import { Router } from 'express';
import { getTriageAlerts, bulkUpdateAlerts } from '../controllers/alert.controller';

const router = Router();

router.get('/triage', getTriageAlerts);
router.patch('/bulk-update', bulkUpdateAlerts);

export default router;
