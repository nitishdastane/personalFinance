import { Request, Response } from 'express';
import {
  getBankAccounts,
  getBankAccountById,
  getCreditCards,
  getCreditCardById,
} from '../services/accountService';

export async function listBankAccounts(req: Request, res: Response) {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    const result = await getBankAccounts(limit, offset);

    return res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Error fetching bank accounts:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch bank accounts',
    });
  }
}

export async function getBankAccount(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const account = await getBankAccountById(id);

    if (!account) {
      return res.status(404).json({
        success: false,
        error: 'Bank account not found',
      });
    }

    return res.json({
      success: true,
      data: account,
    });
  } catch (error) {
    console.error('Error fetching bank account:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch bank account',
    });
  }
}

export async function listCreditCards(req: Request, res: Response) {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    const result = await getCreditCards(limit, offset);

    return res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Error fetching credit cards:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch credit cards',
    });
  }
}

export async function getCreditCard(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const card = await getCreditCardById(id);

    if (!card) {
      return res.status(404).json({
        success: false,
        error: 'Credit card not found',
      });
    }

    return res.json({
      success: true,
      data: card,
    });
  } catch (error) {
    console.error('Error fetching credit card:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch credit card',
    });
  }
}
