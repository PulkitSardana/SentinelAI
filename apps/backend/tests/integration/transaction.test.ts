import request from 'supertest';
import app from '../../src/app';
import { TransactionRepository } from '../../src/repositories/transaction.repository';
import { AccountRepository } from '../../src/repositories/account.repository';
import { MerchantRepository } from '../../src/repositories/merchant.repository';
import { predictionDispatcher } from '../../src/events/prediction.dispatcher';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

jest.mock('../../src/repositories/transaction.repository');
jest.mock('../../src/repositories/account.repository');
jest.mock('../../src/repositories/merchant.repository');
jest.mock('../../src/events/prediction.dispatcher');

describe('Transaction Endpoints', () => {
  let authToken: string;

  beforeAll(() => {
    // Generate a valid JWT token for testing protected routes
    authToken = jwt.sign(
      { id: 'user-123', role: 'ADMIN' },
      process.env.JWT_SECRET || 'supersecret',
      { expiresIn: '1h' }
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validPayload = {
    amount: 150.5,
    currency: 'USD',
    merchant_id: '123e4567-e89b-12d3-a456-426614174000',
    account_id: '987fcdeb-51a2-43d7-9012-345678901234',
    device_id: 'device-123',
    ip_address: '192.168.1.1',
  };

  it('should ingest a valid transaction and dispatch prediction event', async () => {
    (MerchantRepository.findById as jest.Mock).mockResolvedValue({ id: '123e4567-e89b-12d3-a456-426614174000' });
    (AccountRepository.findById as jest.Mock).mockResolvedValue({ id: '987fcdeb-51a2-43d7-9012-345678901234', account_status: 'ACTIVE' });
    (TransactionRepository.create as jest.Mock).mockResolvedValue({ id: 'transaction-uuid', status: 'PENDING' });

    const response = await request(app)
      .post('/api/v1/transactions')
      .set('Authorization', `Bearer ${authToken}`)
      .send(validPayload);

    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.body.success).toBe(true);
    expect(predictionDispatcher.publishTransactionEvaluatedEvent).toHaveBeenCalled();
  });

  it('should reject transaction if merchant does not exist', async () => {
    (MerchantRepository.findById as jest.Mock).mockResolvedValue(null);
    (AccountRepository.findById as jest.Mock).mockResolvedValue({ id: '987fcdeb-51a2-43d7-9012-345678901234', account_status: 'ACTIVE' });

    const response = await request(app)
      .post('/api/v1/transactions')
      .set('Authorization', `Bearer ${authToken}`)
      .send(validPayload);

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body.message).toBe('Invalid merchant ID');
  });

  it('should reject transaction if account is frozen', async () => {
    (MerchantRepository.findById as jest.Mock).mockResolvedValue({ id: '123e4567-e89b-12d3-a456-426614174000' });
    (AccountRepository.findById as jest.Mock).mockResolvedValue({ id: '987fcdeb-51a2-43d7-9012-345678901234', account_status: 'SUSPENDED' });

    const response = await request(app)
      .post('/api/v1/transactions')
      .set('Authorization', `Bearer ${authToken}`)
      .send(validPayload);

    expect(response.status).toBe(StatusCodes.FORBIDDEN);
    expect(response.body.message).toContain('Account is SUSPENDED');
  });

  it('should reject payload with missing required fields (Zod validation)', async () => {
    const invalidPayload = { amount: -50 }; // Missing account_id, merchant_id, currency

    const response = await request(app)
      .post('/api/v1/transactions')
      .set('Authorization', `Bearer ${authToken}`)
      .send(invalidPayload);

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body.message).toContain('Validation failed');
  });

  it('should prevent unauthenticated access', async () => {
    const response = await request(app)
      .post('/api/v1/transactions')
      .send(validPayload);

    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });
});
