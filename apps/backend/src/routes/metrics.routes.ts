import { Router } from 'express';
import { MetricsController } from '@/controllers/metrics.controller';

const router = Router();

router.get('/dashboard', MetricsController.getDashboardMetrics);

export default router;
