import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../utils/asyncHandler';

const prisma = new PrismaClient();

// Get alerts for triage (OPEN and not assigned to a case)
export const getTriageAlerts = asyncHandler(async (req: Request, res: Response) => {
  const alerts = await prisma.fraudAlert.findMany({
    where: {
      status: 'OPEN',
      case_id: null,
    },
    include: {
      transaction: {
        include: {
          account: true,
          merchant: true
        }
      }
    },
    orderBy: {
      risk_score: 'desc' // prioritize high risk
    }
  });

  res.json({
    status: 'success',
    data: { alerts }
  });
});

// Bulk update alerts (e.g. assigning them to a case or dismissing them)
export const bulkUpdateAlerts = asyncHandler(async (req: Request, res: Response) => {
  const { alertIds, status, case_id, resolved_by } = req.body;

  if (!alertIds || !Array.isArray(alertIds) || alertIds.length === 0) {
    return res.status(400).json({ status: 'error', message: 'No alertIds provided' });
  }

  const dataToUpdate: any = {};
  if (status) dataToUpdate.status = status;
  if (case_id !== undefined) dataToUpdate.case_id = case_id;
  if (resolved_by !== undefined) dataToUpdate.resolved_by = resolved_by;

  await prisma.fraudAlert.updateMany({
    where: {
      id: { in: alertIds }
    },
    data: dataToUpdate
  });

  res.json({
    status: 'success',
    message: `Successfully updated ${alertIds.length} alerts`
  });
});
