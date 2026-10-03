import { Response } from 'express';
import { FileRequest } from '../middleware/upload';
import { importBankStatement, importCreditCardStatement } from '../services/importService';

export async function importBankCSV(req: FileRequest, res: Response) {
  try {
    if (!req.fileContent) {
      return res.status(400).json({
        success: false,
        error: 'No file content provided',
      });
    }

    const summary = await importBankStatement(req.fileContent);

    return res.json(summary);
  } catch (error) {
    console.error('Bank import error:', error);
    return res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to import bank statement',
    });
  }
}

export async function importCreditCardCSV(req: FileRequest, res: Response) {
  try {
    if (!req.fileContent) {
      return res.status(400).json({
        success: false,
        error: 'No file content provided',
      });
    }

    const summary = await importCreditCardStatement(req.fileContent);

    return res.json(summary);
  } catch (error) {
    console.error('Credit card import error:', error);
    return res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to import credit card statement',
    });
  }
}
