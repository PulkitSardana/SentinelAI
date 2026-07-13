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

import rateLimit from 'express-rate-limit';

const app: Express = express();

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 1000000, // Increased from 1000 to 1000000 for Benchmarking Phase
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    code: StatusCodes.TOO_MANY_REQUESTS,
    message: 'Too many requests from this IP, please try again later.',
  }
});

app.use(limiter);

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

import { randomUUID } from 'crypto';

// 1.5 Inject Correlation ID
app.use((req, res, next) => {
  const correlationId = req.headers['x-correlation-id'] || randomUUID();
  req.headers['x-correlation-id'] = correlationId;
  res.setHeader('X-Correlation-ID', correlationId);
  next();
});

// 2. Logging Middleware (Pino)
app.use(pinoHttp({ 
  logger,
  genReqId: (req) => (req.headers['x-correlation-id'] as string) || 'unknown',
}));

// 3. API Routes (Health Checks)
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json(APIResponse.success('SentinelAI API Gateway is healthy'));
});

app.get('/api/v1/live', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json(APIResponse.success('Server is live'));
});

app.get('/api/v1/ready', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json(APIResponse.success('Server is ready to accept traffic'));
});

// Authentication Routes
import authRoutes from './routes/auth.routes';
app.use('/api/v1/auth', authRoutes);

// Transaction Routes
import transactionRoutes from './routes/transaction.routes';
import { queueService } from './services/queue.service';
import { streamService } from './services/stream.service';

app.get('/api/v1/system/metrics', async (req, res) => {
  const queueMetrics = await queueService.getMetrics();
  const memoryUsage = process.memoryUsage();
  
  res.status(200).json(APIResponse.success('System metrics retrieved', {
    queue: queueMetrics,
    memory: {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
    },
    sse: {
      activeClients: streamService.getClientCount(),
    }
  }));
});

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

    const correlationId = req.headers['x-correlation-id'] as string;
    
    logger.error({ err, correlationId }, message);

    res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message,
        timestamp: new Date().toISOString(),
        correlationId,
    });
});

export default app;
