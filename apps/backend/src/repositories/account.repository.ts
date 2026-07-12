import { prisma } from '@/database/prisma';
import { Account, Prisma } from '@prisma/client';

export class AccountRepository {
  static async create(data: Prisma.AccountUncheckedCreateInput): Promise<Account> {
    return prisma.account.create({ data });
  }

  static async findById(id: string): Promise<Account | null> {
    return prisma.account.findUnique({
      where: { id },
    });
  }

  static async updateRiskLevel(id: string, risk_level: number): Promise<Account> {
    return prisma.account.update({
      where: { id },
      data: { risk_level },
    });
  }
}
