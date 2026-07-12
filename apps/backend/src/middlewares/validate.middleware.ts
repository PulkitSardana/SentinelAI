import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError, ZodIssue } from 'zod';
import { APIError } from '@/utils/apiError';
import { StatusCodes } from 'http-status-codes';

export const validateRequest =
  (schema: ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Map Zod errors to a readable string
        const zodIssues = (error as unknown as { issues: ZodIssue[] }).issues || (error as unknown as { errors: ZodIssue[] }).errors;
        const errorMessages = zodIssues.map((err: ZodIssue) => `${err.path.join('.')}: ${err.message}`).join(', ');
        next(new APIError(`Validation failed: ${errorMessages}`, StatusCodes.BAD_REQUEST));
      } else {
        next(new APIError('Internal validation error', StatusCodes.INTERNAL_SERVER_ERROR));
      }
    }
  };
