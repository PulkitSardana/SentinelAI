import { prisma } from '@/database/prisma';
import { UserRepository } from '@/repositories/user.repository';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';
import { APIError } from '@/utils/apiError';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { registerSchema, loginSchema } from '@/schemas/auth.schema';

export class AuthService {
  static async register(data: z.infer<typeof registerSchema>['body']) {
    const existingUser = await UserRepository.findByEmail(data.email);
    if (existingUser) {
      throw new APIError('Email already in use', StatusCodes.CONFLICT);
    }

    const password_hash = await PasswordService.hash(data.password);

    const user = await UserRepository.create({
      name: data.name,
      email: data.email,
      password_hash,
      role: 'ANALYST',
    });

    const token = TokenService.generateAccessToken({ id: user.id, role: user.role });

    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    };
  }

  static async login(data: z.infer<typeof loginSchema>['body']) {
    const user = await UserRepository.findByEmail(data.email);

    if (!user) {
      throw new APIError('Invalid email or password', StatusCodes.UNAUTHORIZED);
    }

    if (!user.is_active) {
      throw new APIError('Account is locked or inactive', StatusCodes.FORBIDDEN);
    }

    const isPasswordValid = await PasswordService.compare(data.password, user.password_hash);

    if (!isPasswordValid) {
      await UserRepository.recordFailedLogin(user.email);
      // Future work: If failed_login_attempts > 5, lock account
      throw new APIError('Invalid email or password', StatusCodes.UNAUTHORIZED);
    }

    await UserRepository.resetFailedLogin(user.id);

    const token = TokenService.generateAccessToken({ id: user.id, role: user.role });

    await prisma.session.create({
      data: {
        user_id: user.id,
      }
    });

    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    };
  }

  static async getActiveSessions() {
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
    const sessions = await prisma.session.findMany({
      where: {
        is_active: true,
        last_seen: {
          gte: fifteenMinsAgo,
        }
      },
      include: {
        user: true,
      }
    });

    const activeUsers = new Map();
    sessions.forEach(s => {
      activeUsers.set(s.user.id, {
        id: s.user.id,
        name: s.user.name,
        email: s.user.email,
        role: s.user.role,
        last_seen: s.last_seen,
      });
    });

    return Array.from(activeUsers.values());
  }
}
