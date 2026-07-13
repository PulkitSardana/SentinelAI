import { Queue, Worker, Job } from 'bullmq';
import { logger } from '../utils/logger';
import { streamService } from './stream.service';
import { prisma } from '@/database/prisma';

export interface TransactionPayload {
  amount: number;
  currency: string;
  merchant_id: string;
  account_id: string;
  device_id?: string;
  device_type?: string;
  ip_address?: string;
  browser?: string;
  operating_system?: string;
  city?: string;
  country?: string;
  payment_method?: string;
  transaction_channel?: string;
  is_fraud_ground_truth?: boolean;
  processing_time_ms?: number;
}

export interface QueuePayload {
  transactionId: string;
  correlationId?: string;
}

export interface IQueueService {
  enqueueTransaction(payload: QueuePayload): Promise<void>;
  close(): Promise<void>;
  getMetrics(): Promise<any>;
}

class BullMQService implements IQueueService {
  private queue: Queue;
  private worker: Worker;

  constructor() {
    const connection = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
    };

    this.queue = new Queue('transaction_processing', { connection });

    this.worker = new Worker('transaction_processing', async (job: Job) => {
      await this.processTransaction(job.data as QueuePayload);
    }, { connection, concurrency: 10 });

    this.worker.on('completed', (job) => {
      logger.info(`Job ${job.id} completed successfully`);
    });

    this.worker.on('failed', async (job, err) => {
      logger.error(`Job ${job?.id} failed: ${err.message}`);
      if (job && job.attemptsMade === job.opts.attempts) {
        await this.moveToDLQ(job.data.transactionId, err.message);
      }
    });
  }

  public async enqueueTransaction(payload: QueuePayload): Promise<void> {
    await this.queue.add('process_transaction', payload, {
      removeOnComplete: true,
      removeOnFail: false, // Keep failed jobs in bullmq until processed by DLQ logic
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      }
    });
  }

  private async moveToDLQ(transactionId: string, errorMsg: string) {
    try {
      await prisma.transaction.update({
        where: { id: transactionId },
        data: { status: 'DEAD_LETTER' }
      });
      logger.error({ transactionId, error: errorMsg }, 'Transaction moved to Dead Letter Queue');
    } catch (e) {
      logger.fatal({ transactionId, error: e }, 'Failed to move transaction to DLQ');
    }
  }

  private async processTransaction(payload: { transactionId: string, correlationId?: string }): Promise<void> {
    const { transactionId, correlationId } = payload;
    logger.info({ transactionId, correlationId }, 'Step 1: Job picked up from Queue by Worker');

    // 1. Fetch from DB
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId }
    });

    if (!transaction) {
      throw new Error(`Transaction ${transactionId} not found in DB`);
    }

    try {
      // 2. Call ML Service
      logger.info({ transactionId }, 'Step 2: Calling Python ML Service for inference');
      const mlPayload = {
        amount: transaction.amount,
        currency: transaction.currency,
        merchant_id: transaction.merchant_id,
        account_id: transaction.account_id,
        device_id: transaction.device_id || undefined,
        device_type: transaction.device_type || undefined,
        ip_address: transaction.ip_address || undefined,
        browser: transaction.browser || undefined,
        operating_system: transaction.operating_system || undefined,
        city: transaction.city || undefined,
        country: transaction.country || undefined,
        payment_method: transaction.payment_method || undefined,
        transaction_channel: transaction.transaction_channel || undefined,
        is_fraud_ground_truth: transaction.is_fraud_ground_truth || undefined,
      };

      let riskAssessment;
      try {
        const fetch = require('node-fetch');
        const mlUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';
        const response = await fetch(`${mlUrl}/api/v1/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mlPayload),
        });
        if (!response.ok) throw new Error('ML API failed');
        riskAssessment = await response.json();
      } catch (e) {
        // Mock fallback if ML is down
        riskAssessment = {
          prediction: 'APPROVED',
          risk_score: 0.1,
          confidence: 0.9,
          feature_importance: [],
          explanation: { human_readable: 'ML Failed, defaulted to Approved' }
        };
      }

      // 3. Determine status
      let finalStatus = 'APPROVED';
      if (riskAssessment.risk_score > 0.85) finalStatus = 'DECLINED';
      else if (riskAssessment.risk_score > 0.65) finalStatus = 'FLAGGED';

      // 4. Update DB & 5. Create Fraud Alert via $transaction for ACID guarantees
      logger.info({ transactionId, status: finalStatus }, 'Step 3: ML Inference complete. Updating PostgreSQL Database');
      
      let updatedTx;
      if (finalStatus === 'FLAGGED' || finalStatus === 'DECLINED') {
        const [tx, alert] = await prisma.$transaction([
          prisma.transaction.update({
            where: { id: transaction.id },
            data: { status: finalStatus },
          }),
          prisma.fraudAlert.create({
            data: {
              transaction_id: transaction.id,
              risk_score: riskAssessment.risk_score,
              fraud_probability: riskAssessment.confidence,
              severity: finalStatus === 'DECLINED' ? 'CRITICAL' : 'HIGH',
              recommended_action: finalStatus === 'DECLINED' ? 'Block Transaction' : 'Manual Review',
            },
          })
        ]);
        updatedTx = tx;
      } else {
        updatedTx = await prisma.transaction.update({
          where: { id: transaction.id },
          data: { status: finalStatus },
        });
      }

      // 6. Broadcast via SSE
      logger.info({ transactionId }, 'Step 4: Database commit successful. Broadcasting to Frontend via SSE Stream');
      streamService.broadcast('transaction_processed', {
        ...updatedTx,
        risk_score: riskAssessment.risk_score,
        prediction: riskAssessment.prediction,
        confidence: riskAssessment.confidence,
        feature_importance: riskAssessment.feature_importance,
        explanation: riskAssessment.explanation,
      });

    } catch (error: any) {
      logger.error({ transactionId, error: error.message }, 'Failed to process transaction in worker');
      // Update DB to error state
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: 'ERROR' },
      });
      throw error; // Let BullMQ retry mechanism kick in
    }
  }

  public async close(): Promise<void> {
    await this.worker.close();
    await this.queue.close();
  }

  public async getMetrics(): Promise<any> {
    const counts = await this.queue.getJobCounts();
    return {
      waiting: counts.waiting,
      active: counts.active,
      completed: counts.completed,
      failed: counts.failed,
      delayed: counts.delayed
    };
  }
}

// Export singleton instance of the chosen queue implementation
export const queueService: IQueueService = new BullMQService();
