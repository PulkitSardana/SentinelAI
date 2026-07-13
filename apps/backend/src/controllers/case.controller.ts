import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../utils/asyncHandler';

const prisma = new PrismaClient();

// Get all cases
export const getCases = asyncHandler(async (req: Request, res: Response) => {
  const cases = await prisma.investigationCase.findMany({
    include: {
      alerts: {
        include: {
          transaction: true
        }
      },
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      }
    },
    orderBy: {
      created_at: 'desc'
    }
  });

  res.json({
    status: 'success',
    data: { cases }
  });
});

// Get a single case by ID
export const getCaseById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  
  const investigationCase = await prisma.investigationCase.findUnique({
    where: { id },
    include: {
      alerts: {
        include: {
          transaction: true
        }
      },
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      }
    }
  });

  if (!investigationCase) {
    return res.status(404).json({ status: 'error', message: 'Case not found' });
  }

  res.json({
    status: 'success',
    data: { case: investigationCase }
  });
});

// Create a new case (optionally assigning alerts to it)
export const createCase = asyncHandler(async (req: Request, res: Response) => {
  const { title, priority, alertIds, assignee_id } = req.body;

  const newCase = await prisma.investigationCase.create({
    data: {
      title,
      priority: priority || 'MEDIUM',
      assignee_id: assignee_id || null,
      sla_deadline: new Date(Date.now() + 4 * 60 * 60 * 1000), // Default SLA 4 hours
      alerts: alertIds && alertIds.length > 0 ? {
        connect: alertIds.map((id: string) => ({ id }))
      } : undefined
    },
    include: {
      alerts: true,
      assignee: {
        select: { name: true, email: true }
      }
    }
  });

  res.status(201).json({
    status: 'success',
    data: { case: newCase }
  });
});

// Update a case
export const updateCase = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { status, priority, assignee_id, internal_notes } = req.body;

  const updatedCase = await prisma.investigationCase.update({
    where: { id },
    data: {
      status,
      priority,
      assignee_id,
      internal_notes,
    },
    include: {
      assignee: {
        select: { name: true }
      }
    }
  });

  res.json({
    status: 'success',
    data: { case: updatedCase }
  });
});
