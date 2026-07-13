import { Router } from 'express';
import { TransactionController } from '@/controllers/transaction.controller';
import { validateRequest } from '@/middlewares/validate.middleware';
import { transactionIngestionSchema, transactionQuerySchema } from '@/schemas/transaction.schema';
import { requireAuth } from '@/middlewares/auth.middleware';
import { asyncHandler } from '@/utils/asyncHandler';

const router = Router();

// Streaming endpoint (SSE) - No Auth for easy testing
router.get('/stream', TransactionController.streamTransactions);

import { idempotencyMiddleware } from '@/middlewares/idempotency.middleware';

// Ingestion endpoint - Bypassed auth for Simulator
router.post(
  '/',
  idempotencyMiddleware,
  validateRequest(transactionIngestionSchema),
  asyncHandler(TransactionController.ingest)
);

// Require auth for history and other sensitive endpoints
router.get(
  '/',
  requireAuth,
  validateRequest(transactionQuerySchema),
  asyncHandler(TransactionController.getHistory)
);

export default router;
