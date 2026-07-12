import { StatusCodes } from 'http-status-codes';

export class APIError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(
        message: string,
        statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
        isOperational: boolean = true
    ) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational; // true = expected error (e.g. 404, 400), false = programming bug (e.g. 500)

        // Ensure the stack trace doesn't include this constructor
        Error.captureStackTrace(this, this.constructor);
    }
}
