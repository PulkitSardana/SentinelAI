import { prisma } from '@/database/prisma';
import { Merchant, Prisma } from '@prisma/client';

export class MerchantRepository {
  static async create(data: Prisma.MerchantCreateInput): Promise<Merchant> {
    return prisma.merchant.create({ data });
  }

  static async findById(id: string): Promise<Merchant | null> {
    return prisma.merchant.findUnique({
      where: { id },
    });
  }
}
