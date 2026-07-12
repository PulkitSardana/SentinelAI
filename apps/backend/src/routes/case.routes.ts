import { Router } from 'express';
import { getCases, getCaseById, createCase, updateCase } from '../controllers/case.controller';

const router = Router();

router.route('/')
  .get(getCases)
  .post(createCase);

router.route('/:id')
  .get(getCaseById)
  .patch(updateCase);

export default router;
