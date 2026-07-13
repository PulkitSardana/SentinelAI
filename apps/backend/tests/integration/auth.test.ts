import request from 'supertest';
import app from '../../src/app';
import { UserRepository } from '../../src/repositories/user.repository';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';

import { prisma } from '../../src/database/prisma';

// Mock the UserRepository to avoid hitting a real Postgres database in tests
jest.mock('../../src/repositories/user.repository');
jest.mock('../../src/database/prisma', () => ({
  prisma: {
    session: {
      create: jest.fn(),
    }
  }
}));

describe('Auth Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const testUser = {
    name: 'Test User',
    email: 'test@sentinelai.com',
    password: 'Password123!',
  };

  it('should register a new user', async () => {
    (UserRepository.findByEmail as jest.Mock).mockResolvedValue(null);
    (UserRepository.create as jest.Mock).mockResolvedValue({
      id: 'uuid-1234',
      email: testUser.email,
      role: 'ANALYST',
    });

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(testUser);

    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe(testUser.email);
    expect(response.body.data.token).toBeDefined();
  });

  it('should not register duplicate user', async () => {
    (UserRepository.findByEmail as jest.Mock).mockResolvedValue({ id: 'uuid-1234', email: testUser.email });

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(testUser);

    expect(response.status).toBe(StatusCodes.CONFLICT);
    expect(response.body.status).toBe('error');
  });

  it('should login user and return token', async () => {
    // We need to mock a user with a valid hashed password.
    // However, the test uses PasswordService.compare which actually checks bcrypt.
    // Instead of mocking bcrypt, we can just hash the test password here or mock bcrypt.
    // Let's mock the user DB record. The service will hash the testUser.password.
    // Wait, PasswordService hashes it. We need a real hash of 'Password123!'
    const realHash = await bcrypt.hash(testUser.password, 1);

    (UserRepository.findByEmail as jest.Mock).mockResolvedValue({
      id: 'uuid-1234',
      email: testUser.email,
      password_hash: realHash,
      is_active: true,
      role: 'ANALYST',
    });
    (UserRepository.resetFailedLogin as jest.Mock).mockResolvedValue(undefined);

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send(testUser);

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeDefined();
  });

  it('should fail login with wrong password', async () => {
    const realHash = await bcrypt.hash('CorrectPassword123!', 1);

    (UserRepository.findByEmail as jest.Mock).mockResolvedValue({
      id: 'uuid-1234',
      email: testUser.email,
      password_hash: realHash,
      is_active: true,
    });
    (UserRepository.recordFailedLogin as jest.Mock).mockResolvedValue(undefined);

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testUser.email,
        password: 'WrongPassword123!',
      });

    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    expect(response.body.status).toBe('error');
  });
});
