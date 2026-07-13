import { z } from 'zod';

export const transactionIngestionSchema = z.object({
  body: z.object({
    amount: z.number().int('Amount must be an integer (in cents)').positive('Amount must be positive'),
    currency: z.string().length(3, 'Currency must be a 3-letter ISO code'),
    merchant_id: z.string().uuid('Invalid merchant ID'),
    account_id: z.string().uuid('Invalid account ID'),
    
    // Feature Engineering Attributes
    device_id: z.string().optional(),
    device_type: z.string().optional(),
    ip_address: z.string().optional(),
    browser: z.string().optional(),
    operating_system: z.string().optional(),
    city: z.string().optional(),
    country: z.string().length(2, 'Country must be a 2-letter ISO code').optional(),
    payment_method: z.string().optional(),
    transaction_channel: z.string().optional(),
    is_fraud_ground_truth: z.boolean().optional(),
  }),
});

export type TransactionIngestionDTO = z.infer<typeof transactionIngestionSchema>['body'];

// Schema for strictly validating and sanitizing paginated query parameters
export const transactionQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/, 'Page must be a number').transform(Number).optional().default(1),
    limit: z.string().regex(/^\d+$/, 'Limit must be a number').transform(Number).optional().default(10),
    status: z.enum(['PENDING', 'APPROVED', 'DECLINED', 'FLAGGED_FOR_REVIEW']).optional(),
    merchant_id: z.string().uuid('Invalid merchant ID').optional(),
    account_id: z.string().uuid('Invalid account ID').optional(),
  }),
});

export type TransactionQueryDTO = z.infer<typeof transactionQuerySchema>['query'];
