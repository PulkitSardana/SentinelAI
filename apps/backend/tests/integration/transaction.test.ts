import request from 'supertest';
import app from '../../src/app';
import { StatusCodes } from 'http-status-codes';
import { prisma } from '../../src/database/prisma';
import { queueService } from '../../src/services/queue.service';
import Redis from 'ioredis';

// Mock dependencies
jest.mock('../../src/database/prisma', () => ({
  prisma: {
    transaction: {
      create: jest.fn(),
    }
  }
}));

jest.mock('../../src/services/queue.service', () => ({
  queueService: {
    enqueueTransaction: jest.fn(),
  }
}));

jest.mock('ioredis', () => {
  const mRedis = {
    get: jest.fn(),
    set: jest.fn().mockResolvedValue('OK'),
  };
  return jest.fn(() => mRedis);
});

describe('Transaction Ingestion & Idempotency', () => {
  const redisInstance = new Redis();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validPayload = {
    amount: 15050,
    currency: 'USD',
    merchant_id: '123e4567-e89b-12d3-a456-426614174000',
    account_id: '987fcdeb-51a2-43d7-9012-345678901234',
    device_id: 'device-123',
    ip_address: '192.168.1.1',
  };

  it('should successfully ingest a transaction, write to DB, and enqueue to BullMQ', async () => {
    const mockTxId = 'txn-uuid-123';
    (prisma.transaction.create as jest.Mock).mockResolvedValue({ id: mockTxId, status: 'QUEUED' });
    (redisInstance.get as jest.Mock).mockResolvedValue(null); // No idempotency cache hit

    const response = await request(app)
      .post('/api/v1/transactions')
      .send(validPayload);

    expect(response.status).toBe(StatusCodes.ACCEPTED);
    expect(response.body.data.status).toBe('QUEUED');
    expect(response.body.data.transaction_id).toBe(mockTxId);
    
    expect(prisma.transaction.create).toHaveBeenCalledTimes(1);
    expect(queueService.enqueueTransaction).toHaveBeenCalledTimes(1);
    expect(queueService.enqueueTransaction).toHaveBeenCalledWith({
      transactionId: mockTxId,
      correlationId: expect.any(String),
    });
  });

  it('should return cached response if Idempotency-Key matches', async () => {
    const mockCachedResponse = JSON.stringify({
      success: true,
      message: 'Transaction queued successfully',
      data: { status: 'QUEUED', transaction_id: 'cached-txn-123' }
    });

    // Simulate cache hit
    (redisInstance.get as jest.Mock).mockResolvedValue(mockCachedResponse);

    const response = await request(app)
      .post('/api/v1/transactions')
      .set('Idempotency-Key', 'req-123')
      .send(validPayload);

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body.data.transaction_id).toBe('cached-txn-123');
    
    // DB and Queue should NOT be called
    expect(prisma.transaction.create).not.toHaveBeenCalled();
    expect(queueService.enqueueTransaction).not.toHaveBeenCalled();
  });

  it('should reject payload with missing required fields (Zod validation)', async () => {
    const invalidPayload = { amount: -500 }; 

    const response = await request(app)
      .post('/api/v1/transactions')
      .send(invalidPayload);

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body.message).toContain('Validation failed');
  });
});
