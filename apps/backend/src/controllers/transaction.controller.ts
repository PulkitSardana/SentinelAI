import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { TransactionService } from '@/services/transaction.service';
import { TransactionRepository } from '@/repositories/transaction.repository';
import { TransactionIngestionDTO, TransactionQueryDTO } from '@/schemas/transaction.schema';
import { streamService } from '@/services/stream.service';
import { APIResponse } from '@/utils/apiResponse';
import { logger } from '@/utils/logger';
import { prisma } from '@/database/prisma';

export class TransactionController {
  
  static streamTransactions(req: Request, res: Response) {
    // Setup headers for Server-Sent Events
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    // Flush headers to establish connection immediately
    res.flushHeaders();

    streamService.addClient(res);
  }

  static async ingest(req: Request, res: Response) {
    const payload = req.body as TransactionIngestionDTO;
    
    try {
      const correlationId = req.headers['x-correlation-id'] as string;
      const traceId = payload.merchant_id || 'unknown';
      logger.info({ traceId, correlationId }, 'Step 0: API Gateway received transaction payload. Writing to PostgreSQL.');

      // 1. Durably save to DB as QUEUED
      const transaction = await prisma.transaction.create({
        data: {
          ...payload,
          status: 'QUEUED',
        },
      });

      // Setup the queue service (assuming it's imported at the top)
      const { queueService } = require('../services/queue.service');
      
      logger.info({ traceId, transactionId: transaction.id }, 'Step 0.5: Enqueuing to BullMQ.');

      // 2. Enqueue only the UUID for asynchronous processing
      await queueService.enqueueTransaction({ transactionId: transaction.id, correlationId });
      
      res.status(StatusCodes.ACCEPTED).json(
        APIResponse.success('Transaction queued successfully', { status: 'QUEUED', transaction_id: transaction.id })
      );
    } catch (error) {
      console.error('Failed to queue transaction:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        APIResponse.error('Failed to queue transaction')
      );
    }
  }

  static async getHistory(req: Request, res: Response) {
    const query = req.query as unknown as TransactionQueryDTO;
    
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.merchant_id) where.merchant_id = query.merchant_id;
    if (query.account_id) where.account_id = query.account_id;

    const { data, total } = await TransactionRepository.findManyWithFilters(skip, limit, where);
    
    res.status(StatusCodes.OK).json(
      APIResponse.success('Transaction history retrieved', {
        transactions: data,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        }
      })
    );
  }
}
