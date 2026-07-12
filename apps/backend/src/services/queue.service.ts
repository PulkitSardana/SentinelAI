import { Queue, Worker, Job } from 'bullmq';
import { logger } from '../utils/logger';
import { mlService } from './ml.service';
import { streamService } from './stream.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

export interface IQueueService {
  enqueueTransaction(payload: TransactionPayload): Promise<void>;
  close(): Promise<void>;
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
      await this.processTransaction(job.data as TransactionPayload);
    }, { connection, concurrency: 10 });

    this.worker.on('completed', (job) => {
      logger.info(`Job ${job.id} completed successfully`);
    });

    this.worker.on('failed', (job, err) => {
      logger.error(`Job ${job?.id} failed: ${err.message}`);
    });
  }

  public async enqueueTransaction(payload: TransactionPayload): Promise<void> {
    await this.queue.add('process_transaction', payload, {
      removeOnComplete: true,
      removeOnFail: 1000,
    });
  }

  private async processTransaction(payload: TransactionPayload): Promise<void> {
    // 1. Save to DB as PENDING
    const transaction = await prisma.transaction.create({
      data: {
        ...payload,
        status: 'PENDING',
      },
    });

    try {
      // 2. Call ML Service
      const riskAssessment = await mlService.evaluateRisk(payload);

      // 3. Determine status
      let finalStatus = 'APPROVED';
      if (riskAssessment.risk_score > 0.85) finalStatus = 'DECLINED';
      else if (riskAssessment.risk_score > 0.65) finalStatus = 'FLAGGED';

      // 4. Update DB
      const updatedTx = await prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: finalStatus },
      });

      // 5. Create Fraud Alert if risky
      if (finalStatus === 'FLAGGED' || finalStatus === 'DECLINED') {
        await prisma.fraudAlert.create({
          data: {
            transaction_id: transaction.id,
            risk_score: riskAssessment.risk_score,
            fraud_probability: riskAssessment.confidence,
            severity: finalStatus === 'DECLINED' ? 'CRITICAL' : 'HIGH',
            recommended_action: finalStatus === 'DECLINED' ? 'Block Transaction' : 'Manual Review',
          },
        });
      }

      // 6. Broadcast via SSE
      streamService.broadcastTransaction({
        ...updatedTx,
        risk_score: riskAssessment.risk_score,
        prediction: riskAssessment.prediction,
        confidence: riskAssessment.confidence,
        feature_importance: riskAssessment.feature_importance,
        explanation: riskAssessment.explanation,
      });

    } catch (error) {
      logger.error('Failed to process transaction in worker', error);
      // Update DB to error state
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: 'ERROR' },
      });
    }
  }

  public async close(): Promise<void> {
    await this.worker.close();
    await this.queue.close();
  }
}

// Export singleton instance of the chosen queue implementation
export const queueService: IQueueService = new BullMQService();
