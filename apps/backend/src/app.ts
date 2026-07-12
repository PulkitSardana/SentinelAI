import express, { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import hpp from 'hpp';
import pinoHttp from 'pino-http';
import { StatusCodes } from 'http-status-codes';

import { logger } from '@/utils/logger';
import { APIError } from '@/utils/apiError';
import { APIResponse } from '@/utils/apiResponse';

const app: Express = express();

// 1. Security & Utility Middlewares
app.use(helmet()); // Set secure HTTP headers
app.use(cors({ origin: '*', credentials: true })); // Configure CORS
app.use(compression({
  filter: (req, res) => {
    if (req.headers['accept'] === 'text/event-stream') {
      return false; // Do not compress SSE streams, otherwise they get buffered
    }
    return compression.filter(req, res);
  }
})); // Compress response bodies for speed
app.use(express.json({ limit: '10kb' })); // Parse JSON bodies (limit size to prevent DOS attacks)
app.use(express.urlencoded({ extended: true, limit: '10kb' })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies
app.use(hpp()); // Prevent HTTP Parameter Pollution

// 2. Logging Middleware (Pino)
app.use(pinoHttp({ logger }));

// 3. API Routes (Health Checks)
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json(APIResponse.success('SentinelAI API Gateway is healthy'));
});

app.get('/api/v1/live', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json(APIResponse.success('Server is live'));
});

app.get('/api/v1/ready', (req: Request, res: Response) => {
  // TODO: Add database connection check here later
  res.status(StatusCodes.OK).json(APIResponse.success('Server is ready to accept traffic'));
});

// Authentication Routes
import authRoutes from './routes/auth.routes';
app.use('/api/v1/auth', authRoutes);

// Transaction Routes
import transactionRoutes from './routes/transaction.routes';
app.use('/api/v1/transactions', transactionRoutes);

// Case Routes
import caseRoutes from './routes/case.routes';
app.use('/api/v1/cases', caseRoutes);

// Alert Routes
import alertRoutes from './routes/alert.routes';
app.use('/api/v1/alerts', alertRoutes);

// Metrics Routes
import metricsRoutes from './routes/metrics.routes';
app.use('/api/v1/metrics', metricsRoutes);

// MLOps Routes
import { mlopsRouter } from './routes/mlops.routes';
app.use('/api/v1/mlops', mlopsRouter);

// 4. Handle 404 - Unknown Routes
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new APIError(`Cannot find ${req.originalUrl} on this server!`, StatusCodes.NOT_FOUND));
});

// 5. Global Error Handling Middleware
app.use((err: Error | APIError, req: Request, res: Response, next: NextFunction) => {
    let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';

    if (err instanceof APIError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    // Log the error via Pino. pino-http automatically attaches req.id to the req object.
    logger.error({ err, reqId: (req as unknown as { id: string }).id }, message);

    res.status(statusCode).json({
        success: false,
        message,
        data: null,
        timestamp: new Date().toISOString(),
        requestId: (req as unknown as { id: string }).id || 'unknown',
    });
});

export default app;
