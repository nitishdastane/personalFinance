import { Request, Response } from 'express';
import { getDashboardSummary } from '../services/dashboardService';

export async function getSummary(req: Request, res: Response) {
  try {
    const summary = await getDashboardSummary();

    return res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard summary',
    });
  }
}
