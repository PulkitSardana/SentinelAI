import request from 'supertest';
import app from '../../src/app';
import { StatusCodes } from 'http-status-codes';

describe('Health Check Endpoints', () => {
  it('should return 200 OK for /api/v1/health', async () => {
    const response = await request(app).get('/api/v1/health');
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('SentinelAI API Gateway is healthy');
    expect(response.body).toHaveProperty('timestamp');
  });

  it('should return 200 OK for /api/v1/live', async () => {
    const response = await request(app).get('/api/v1/live');
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body.success).toBe(true);
  });

  it('should return 200 OK for /api/v1/ready', async () => {
    const response = await request(app).get('/api/v1/ready');
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body.success).toBe(true);
  });
});
