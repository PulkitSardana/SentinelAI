import { Request, Response } from 'express';
import { AuthService } from '@/services/auth.service';
import { APIResponse } from '@/utils/apiResponse';
import { StatusCodes } from 'http-status-codes';

export class AuthController {
  static async register(req: Request, res: Response) {
    const result = await AuthService.register(req.body);
    res.status(StatusCodes.CREATED).json(APIResponse.success('User registered successfully', result));
  }

  static async login(req: Request, res: Response) {
    const result = await AuthService.login(req.body);
    res.status(StatusCodes.OK).json(APIResponse.success('Login successful', result));
  }

  static async getActiveSessions(req: Request, res: Response) {
    const sessions = await AuthService.getActiveSessions();
    res.status(StatusCodes.OK).json(APIResponse.success('Active sessions retrieved', sessions));
  }
}
