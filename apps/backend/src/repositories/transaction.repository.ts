import { prisma } from '@/database/prisma';
import { Transaction, Prisma } from '@prisma/client';

export class TransactionRepository {
  static async create(data: Prisma.TransactionUncheckedCreateInput): Promise<Transaction> {
    return prisma.transaction.create({ data });
  }

  static async findById(id: string): Promise<Transaction | null> {
    return prisma.transaction.findUnique({
      where: { id },
    });
  }

  static async update(id: string, data: Prisma.TransactionUpdateInput): Promise<Transaction> {
    return prisma.transaction.update({
      where: { id },
      data,
    });
  }

  static async findManyWithFilters(
    skip: number,
    take: number,
    where: Prisma.TransactionWhereInput
  ): Promise<{ data: Transaction[]; total: number }> {
    const [data, total] = await Promise.all([
      prisma.transaction.findMany({
        skip,
        take,
        where,
        orderBy: { timestamp: 'desc' },
      }),
      prisma.transaction.count({ where }),
    ]);

    return { data, total };
  }
}
