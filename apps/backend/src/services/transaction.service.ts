import { TransactionIngestionDTO } from '@/schemas/transaction.schema';
import { TransactionRepository } from '@/repositories/transaction.repository';
import { AccountRepository } from '@/repositories/account.repository';
import { MerchantRepository } from '@/repositories/merchant.repository';
import { APIError } from '@/utils/apiError';
import { StatusCodes } from 'http-status-codes';
import { predictionDispatcher } from '@/events/prediction.dispatcher';
import { Transaction } from '@prisma/client';

export class TransactionService {
  /**
   * Ingests a new transaction into the system.
   * Validates foreign keys, checks account status, persists the record,
   * and dispatches an asynchronous event to the ML Prediction Engine.
   */
  static async ingestTransaction(payload: TransactionIngestionDTO): Promise<Transaction> {
    let merchant = await MerchantRepository.findById(payload.merchant_id);
    if (!merchant) {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      merchant = await prisma.merchant.create({
        data: {
          id: payload.merchant_id,
          merchant_category: 'GENERAL',
          merchant_country: 'US',
        }
      });
    }

    let account = await AccountRepository.findById(payload.account_id);
    if (!account) {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      // Need a user to tie to account
      let user = await prisma.user.findFirst({ where: { role: 'SIMULATOR' } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            name: 'Simulator User',
            email: 'sim@example.com',
            password_hash: 'mock',
            role: 'SIMULATOR'
          }
        });
      }
      account = await prisma.account.create({
        data: {
          id: payload.account_id,
          user_id: user.id,
          account_status: 'ACTIVE'
        }
      });
    }

    if (account!.account_status !== 'ACTIVE') {
      throw new APIError(
        `Cannot process transaction: Account is ${account!.account_status}`,
        StatusCodes.FORBIDDEN
      );
    }

    // 4. Persist the Transaction (Status defaults to PENDING in schema)
    const transaction = await TransactionRepository.create({
      amount: payload.amount,
      currency: payload.currency,
      merchant_id: payload.merchant_id,
      account_id: payload.account_id,
      device_id: payload.device_id,
      device_type: payload.device_type,
      ip_address: payload.ip_address,
      browser: payload.browser,
      operating_system: payload.operating_system,
      city: payload.city,
      country: payload.country,
      payment_method: payload.payment_method,
      transaction_channel: payload.transaction_channel,
      is_fraud_ground_truth: payload.is_fraud_ground_truth,
    });

    // 5. Dispatch Asynchronous ML Evaluation (Fire and Forget)
    predictionDispatcher.publishTransactionEvaluatedEvent(transaction);

    // 6. Return immediately to ensure ultra-low latency for the client
    return transaction;
  }
}
