import express from 'express';
import { importBankCSV, importCreditCardCSV } from '../controllers/importController';
import {
  listBankAccounts,
  getBankAccount,
  listCreditCards,
  getCreditCard,
} from '../controllers/accountController';
import { listBankTransactions, listCreditCardTransactions } from '../controllers/transactionController';
import { getSummary } from '../controllers/dashboardController';
import { uploadMiddleware } from '../middleware/upload';

const router = express.Router();

// Import routes
router.post('/import/bank', uploadMiddleware, importBankCSV);
router.post('/import/credit-card', uploadMiddleware, importCreditCardCSV);

// Account routes
router.get('/accounts/banks', listBankAccounts);
router.get('/accounts/banks/:id', getBankAccount);
router.get('/accounts/credit-cards', listCreditCards);
router.get('/accounts/credit-cards/:id', getCreditCard);

// Transaction routes
router.get('/bank-transactions', listBankTransactions);
router.get('/credit-card-transactions', listCreditCardTransactions);

// Dashboard routes
router.get('/dashboard/summary', getSummary);

export default router;
