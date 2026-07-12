import { prisma } from '@/database/prisma';
import { FraudAlert, Prisma } from '@prisma/client';

export class FraudAlertRepository {
  static async create(data: Prisma.FraudAlertUncheckedCreateInput): Promise<FraudAlert> {
    return prisma.fraudAlert.create({ data });
  }

  static async findById(id: string): Promise<FraudAlert | null> {
    return prisma.fraudAlert.findUnique({
      where: { id },
    });
  }
}
