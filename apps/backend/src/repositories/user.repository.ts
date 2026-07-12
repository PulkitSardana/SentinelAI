import { prisma } from '@/database/prisma';
import { User, Prisma } from '@prisma/client';

export class UserRepository {
  static async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  }

  static async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  static async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  static async recordFailedLogin(email: string): Promise<void> {
    await prisma.user.update({
      where: { email },
      data: {
        failed_login_attempts: { increment: 1 },
      },
    });
  }

  static async resetFailedLogin(id: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: {
        failed_login_attempts: 0,
        last_login: new Date(),
      },
    });
  }
}
