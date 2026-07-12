import app from './app';
import { env } from '@/config/env';
import { logger } from '@/utils/logger';

const PORT = env.PORT || 5000;

const server = app.listen(PORT, () => {
    logger.info(`🚀 SentinelAI API Gateway running in ${env.NODE_ENV} mode on port ${PORT}`);
});

// Graceful Shutdown Mechanism
const unexpectedErrorHandler = (error: Error) => {
    logger.fatal(error, 'Unhandled Exception/Rejection. Shutting down gracefully...');
    // Stop accepting new connections, finish existing ones, then exit.
    server.close(() => {
        process.exit(1);
    });
};

// Catch synchronous bugs (e.g. typos, undefined variables)
process.on('uncaughtException', unexpectedErrorHandler);

// Catch asynchronous bugs (e.g. unhandled Promise rejections)
process.on('unhandledRejection', unexpectedErrorHandler);

// Catch termination signals from Docker / Kubernetes (e.g. during a new deployment)
process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        logger.info('Process terminated.');
        process.exit(0);
    });
});
