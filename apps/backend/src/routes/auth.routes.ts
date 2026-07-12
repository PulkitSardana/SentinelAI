import { Router } from 'express';
import { AuthController } from '@/controllers/auth.controller';
import { validateRequest } from '@/middlewares/validate.middleware';
import { registerSchema, loginSchema } from '@/schemas/auth.schema';
import { asyncHandler } from '@/utils/asyncHandler';

const router = Router();

router.post('/register', validateRequest(registerSchema), asyncHandler(AuthController.register));
router.post('/login', validateRequest(loginSchema), asyncHandler(AuthController.login));
router.get('/active-sessions', asyncHandler(AuthController.getActiveSessions));

export default router;
