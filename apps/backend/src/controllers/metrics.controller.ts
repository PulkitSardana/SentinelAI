import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { APIResponse } from '@/utils/apiResponse';
import { prisma } from '@/database/prisma';

export class MetricsController {
  static async getDashboardMetrics(req: Request, res: Response) {
    try {
      // Total Transactions & Distribution
      const distributionRaw = await prisma.transaction.groupBy({
        by: ['status'],
        _count: {
          id: true
        }
      });

      let totalTransactions = 0;
      let approvedCount = 0;
      let flaggedCount = 0;
      let declinedCount = 0;

      for (const row of distributionRaw) {
        totalTransactions += row._count.id;
        if (row.status === 'APPROVED') approvedCount = row._count.id;
        if (row.status === 'FLAGGED_FOR_REVIEW') flaggedCount = row._count.id;
        if (row.status === 'DECLINED') declinedCount = row._count.id;
      }

      // Fraud Rate & ML Metrics
      // Fraud Alerts count
      const totalAlerts = await prisma.fraudAlert.count();
      const fraudRate = totalTransactions > 0 ? (totalAlerts / totalTransactions) * 100 : 0;

      // Honest ML Metrics (Ground truth vs Prediction)
      // True Positives: Ground truth is True, and model DECLINED or FLAGGED
      const tp = await prisma.transaction.count({
        where: {
          is_fraud_ground_truth: true,
          status: { in: ['DECLINED', 'FLAGGED_FOR_REVIEW'] }
        }
      });

      // False Negatives: Ground truth is True, but model APPROVED
      const fn = await prisma.transaction.count({
        where: {
          is_fraud_ground_truth: true,
          status: 'APPROVED'
        }
      });

      // Recall (Detection Rate) = TP / (TP + FN)
      const recall = (tp + fn) > 0 ? (tp / (tp + fn)) * 100 : 0;

      // False Positives: Ground truth is False, but model DECLINED or FLAGGED
      const fp = await prisma.transaction.count({
        where: {
          is_fraud_ground_truth: false,
          status: { in: ['DECLINED', 'FLAGGED_FOR_REVIEW'] }
        }
      });

      // Precision = TP / (TP + FP)
      const precision = (tp + fp) > 0 ? (tp / (tp + fp)) * 100 : 0;

      // Latency Metrics
      const latencyResult = await prisma.transaction.aggregate({
        _avg: {
          processing_time_ms: true
        }
      });
      const avgLatency = latencyResult._avg.processing_time_ms || 0;

      const data = {
        kpis: {
          totalTransactions,
          fraudRate,
          detectionRecall: recall,
          detectionPrecision: precision,
          avgLatency
        },
        distribution: [
          { name: 'Approved', value: approvedCount, color: '#10b981' },
          { name: 'Flagged', value: flaggedCount, color: '#eab308' },
          { name: 'Declined (Fraud)', value: declinedCount, color: '#ef4444' }
        ]
      };

      res.status(StatusCodes.OK).json(
        APIResponse.success('Dashboard metrics retrieved successfully', data)
      );
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        APIResponse.error('Failed to retrieve metrics')
      );
    }
  }
}
