import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';
import { StatusCodes } from 'http-status-codes';
import { APIResponse } from '@/utils/apiResponse';
import { logger } from '@/utils/logger';

const redisConfig: any = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
};

if (process.env.REDIS_PASSWORD) {
  redisConfig.password = process.env.REDIS_PASSWORD;
}

if (process.env.REDIS_TLS === 'true') {
  redisConfig.tls = {};
}

const redis = new Redis(redisConfig);

export const idempotencyMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const idempotencyKey = req.headers['idempotency-key'];
  
  if (!idempotencyKey) {
    return next(); // Proceed without idempotency if not provided (optional for API clients)
  }

  const redisKey = `idempotent:${idempotencyKey}`;
  
  try {
    const cachedResponse = await redis.get(redisKey);

    if (cachedResponse) {
      logger.info({ idempotencyKey, correlationId: req.headers['x-correlation-id'] }, 'Idempotency cache hit. Replaying response.');
      return res.status(StatusCodes.OK).json(JSON.parse(cachedResponse));
    }

    // Intercept res.json to cache the successful response
    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      // Only cache 2xx successes
      if (res.statusCode >= 200 && res.statusCode < 300) {
        // Cache for 24 hours
        redis.set(redisKey, JSON.stringify(body), 'EX', 86400).catch((err) => {
          logger.error({ error: err.message }, 'Failed to store idempotency key');
        });
      }
      return originalJson(body);
    };

    next();
  } catch (error) {
    logger.error({ error }, 'Redis error in idempotency middleware');
    // If Redis is down, fail open to not block processing
    next();
  }
};
