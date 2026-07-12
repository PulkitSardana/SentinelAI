import { Transaction } from '@prisma/client';
import { logger } from '@/utils/logger';

export interface IEventPublisher {
  publishTransactionEvaluatedEvent(transaction: Transaction): Promise<void>;
}

export class PredictionDispatcher implements IEventPublisher {
  /**
   * Dispatches a transaction to the Machine Learning Prediction Engine.
   * Currently implemented as an asynchronous HTTP placeholder.
   * Designed to be swapped seamlessly with Kafka/RabbitMQ in the future.
   */
  async publishTransactionEvaluatedEvent(transaction: Transaction): Promise<void> {
    try {
      // Future Kafka Implementation:
      // await kafkaProducer.send({ topic: 'transactions.evaluate', messages: [ { value: JSON.stringify(transaction) } ] });

      // MVP Implementation: Async Fire-and-Forget HTTP
      logger.info({ transactionId: transaction.id }, 'Dispatching transaction to ML Prediction Engine');
      
      // Simulate an async network call to the Python FastAPI service
      // fetch('http://ml-service:8000/predict', { method: 'POST', body: JSON.stringify(transaction) }).catch(err => logger.error(err));
      
      // We do not await or block the main thread, mimicking event-driven fire-and-forget
      Promise.resolve().then(() => {
        logger.debug({ transactionId: transaction.id }, 'Transaction successfully dispatched to ML service');
      });

    } catch (error) {
      logger.error({ err: error, transactionId: transaction.id }, 'Failed to dispatch transaction to prediction engine');
      // Future: Drop failed messages into a Dead Letter Queue (DLQ) for retry.
    }
  }
}

export const predictionDispatcher = new PredictionDispatcher();
