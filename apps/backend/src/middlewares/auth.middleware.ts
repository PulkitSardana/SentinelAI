import { Request, Response, NextFunction } from 'express';
import { TokenService, TokenPayload } from '@/services/token.service';
import { APIError } from '@/utils/apiError';
import { StatusCodes } from 'http-status-codes';

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new APIError('Not authenticated. Bearer token missing.', StatusCodes.UNAUTHORIZED));
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = TokenService.verifyAccessToken(token);
    // Attach payload to req for use in downstream controllers
    (req as AuthRequest).user = payload;
    next();
  } catch {
    return next(new APIError('Invalid or expired token', StatusCodes.UNAUTHORIZED));
  }
};
