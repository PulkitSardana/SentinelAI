import { Router } from 'express';
import { MLOpsController } from '../controllers/mlops.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/registry', asyncHandler(MLOpsController.getModelRegistry));
router.get('/experiments', asyncHandler(MLOpsController.getExperiments));
router.get('/dataset', asyncHandler(MLOpsController.getDatasetStats));

export { router as mlopsRouter };
