import { Request, Response } from 'express';
import { getBankTransactions, getCreditCardTransactions } from '../services/transactionService';
import { TransactionFilters } from '../types/index';

export async function listBankTransactions(req: Request, res: Response) {
  try {
    const filters: TransactionFilters = {
      accountId: req.query.accountId as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      search: req.query.search as string,
      type: req.query.type as string,
      minAmount: req.query.minAmount ? parseFloat(req.query.minAmount as string) : undefined,
      maxAmount: req.query.maxAmount ? parseFloat(req.query.maxAmount as string) : undefined,
      sortBy: (req.query.sortBy as string) || 'transactionDate',
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      pageSize: Math.min(parseInt(req.query.pageSize as string) || 50, 100),
    };

    const result = await getBankTransactions(filters);

    return res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Error fetching bank transactions:', error);
    return res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch bank transactions',
    });
  }
}

export async function listCreditCardTransactions(req: Request, res: Response) {
  try {
    const filters: TransactionFilters = {
      accountId: req.query.accountId as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      search: req.query.search as string,
      type: req.query.type as string,
      minAmount: req.query.minAmount ? parseFloat(req.query.minAmount as string) : undefined,
      maxAmount: req.query.maxAmount ? parseFloat(req.query.maxAmount as string) : undefined,
      sortBy: (req.query.sortBy as string) || 'transactionDate',
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      pageSize: Math.min(parseInt(req.query.pageSize as string) || 50, 100),
    };

    const result = await getCreditCardTransactions(filters);

    return res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Error fetching credit card transactions:', error);
    return res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch credit card transactions',
    });
  }
}
