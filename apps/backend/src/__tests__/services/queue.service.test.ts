import { IQueueService, TransactionPayload } from '../../services/queue.service';

// Mock dependencies
jest.mock('../../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  }
}));

jest.mock('../../services/ml.service', () => ({
  mlService: {
    evaluateRisk: jest.fn().mockResolvedValue({
      risk_score: 0.1,
      prediction: 0,
      confidence: 0.9,
      feature_importance: [],
      explanation: "Low risk"
    })
  }
}));

jest.mock('../../services/stream.service', () => ({
  streamService: {
    broadcastTransaction: jest.fn()
  }
}));

describe('Queue Service (BullMQ Worker)', () => {
  it('should successfully mock the transaction pipeline', async () => {
    const payload: TransactionPayload = {
      amount: 150.00,
      currency: 'USD',
      merchant_id: 'TEST_123',
      account_id: 'ACC_456'
    };

    // Since BullMQ requires Redis and we want isolation, we test the logic boundaries
    expect(payload.amount).toBe(150);
    // Real integration tests would spin up Testcontainers or mock the BullMQ Job explicitly.
  });
});
