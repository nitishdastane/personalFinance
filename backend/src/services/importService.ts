import { PrismaClient } from '@prisma/client';
import {
  parseCSVContent,
  parseBankTransaction,
  parseCreditCardTransaction,
  validateBankCSVHeaders,
  validateCreditCardCSVHeaders,
} from '../utils/csvParser';
import {
  generateBankTransactionFingerprint,
  generateCreditCardTransactionFingerprint,
} from '../utils/fingerprint';
import { ImportSummary, ValidationError } from '../types/index';

const prisma = new PrismaClient();

export async function importBankStatement(csvContent: string): Promise<ImportSummary> {
  const invalidRows: ValidationError[] = [];
  let rowsProcessed = 0;
  let newTransactions = 0;
  let duplicatesSkipped = 0;
  const groupedByAccount: Map<string, any[]> = new Map();

  try {
    const records = parseCSVContent(csvContent);

    // Validate headers
    const headers = Object.keys(records[0] || {});
    const headerValidation = validateBankCSVHeaders(headers);
    if (!headerValidation.valid) {
      throw new Error(`Missing required columns: ${headerValidation.missing.join(', ')}`);
    }

    // Parse and group by account
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const rowNumber = i + 2; // +2 because row 1 is header, row 2 is first data row

      const parsed = parseBankTransaction(record, rowNumber);
      if (parsed.error) {
        invalidRows.push(parsed.error);
        continue;
      }

      rowsProcessed++;
      const bankName = parsed.data!.bankName;

      if (!groupedByAccount.has(bankName)) {
        groupedByAccount.set(bankName, []);
      }
      groupedByAccount.get(bankName)!.push(parsed.data);
    }

    // Process each account
    for (const [bankName, transactions] of groupedByAccount) {
      // Find or create account
      let account = await prisma.bankAccount.findUnique({
        where: { name: bankName },
      });

      if (!account) {
        account = await prisma.bankAccount.create({
          data: { name: bankName },
        });
      }

      // Check for duplicates and insert new transactions
      for (const tx of transactions) {
        const fingerprint = generateBankTransactionFingerprint(
          tx.debitAmount,
          tx.creditAmount,
          tx.balance,
          tx.transactionDate,
          tx.transactionDetails
        );

        const existing = await prisma.bankTransaction.findUnique({
          where: {
            bankAccountId_fingerprint: {
              bankAccountId: account.id,
              fingerprint,
            },
          },
        });

        if (existing) {
          duplicatesSkipped++;
        } else {
          await prisma.bankTransaction.create({
            data: {
              bankAccountId: account.id,
              transactionDate: tx.transactionDate,
              transactionDetails: tx.transactionDetails,
              debitAmount: tx.debitAmount,
              creditAmount: tx.creditAmount,
              balance: tx.balance,
              fingerprint,
            },
          });
          newTransactions++;
        }
      }
    }

    // Get transaction date range
    const bankAccountNames = Array.from(groupedByAccount.keys());
    let startDate: string | null = null;
    let endDate: string | null = null;

    if (bankAccountNames.length > 0) {
      const accounts = await prisma.bankAccount.findMany({
        where: {
          name: {
            in: bankAccountNames,
          },
        },
        include: {
          transactions: {
            orderBy: { transactionDate: 'asc' },
            select: { transactionDate: true },
            take: 1,
          },
        },
      });

      const accountTransactions = await prisma.bankTransaction.findMany({
        where: {
          bankAccount: {
            name: {
              in: bankAccountNames,
            },
          },
        },
        select: { transactionDate: true },
        orderBy: { transactionDate: 'asc' },
        take: 1,
      });

      const accountTransactionsMax = await prisma.bankTransaction.findMany({
        where: {
          bankAccount: {
            name: {
              in: bankAccountNames,
            },
          },
        },
        select: { transactionDate: true },
        orderBy: { transactionDate: 'desc' },
        take: 1,
      });

      if (accountTransactions.length > 0) {
        startDate = accountTransactions[0].transactionDate.toISOString().split('T')[0];
      }
      if (accountTransactionsMax.length > 0) {
        endDate = accountTransactionsMax[0].transactionDate.toISOString().split('T')[0];
      }
    }

    const firstAccountName = Array.from(groupedByAccount.keys())[0] || 'Unknown';
    const account = await prisma.bankAccount.findUnique({
      where: { name: firstAccountName },
    });

    return {
      success: true,
      accountId: account?.id || '',
      accountName: firstAccountName,
      rowsProcessed,
      newTransactions,
      duplicatesSkipped,
      invalidRows,
      transactionPeriod: {
        startDate,
        endDate,
      },
    };
  } catch (error) {
    throw new Error(`Failed to import bank statement: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function importCreditCardStatement(csvContent: string): Promise<ImportSummary> {
  const invalidRows: ValidationError[] = [];
  let rowsProcessed = 0;
  let newTransactions = 0;
  let duplicatesSkipped = 0;
  const groupedByCard: Map<string, any[]> = new Map();

  try {
    const records = parseCSVContent(csvContent);

    // Validate headers
    const headers = Object.keys(records[0] || {});
    const headerValidation = validateCreditCardCSVHeaders(headers);
    if (!headerValidation.valid) {
      throw new Error(`Missing required columns: ${headerValidation.missing.join(', ')}`);
    }

    // Parse and group by card
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const rowNumber = i + 2;

      const parsed = parseCreditCardTransaction(record, rowNumber);
      if (parsed.error) {
        invalidRows.push(parsed.error);
        continue;
      }

      rowsProcessed++;
      const creditCardName = parsed.data!.creditCardName;

      if (!groupedByCard.has(creditCardName)) {
        groupedByCard.set(creditCardName, []);
      }
      groupedByCard.get(creditCardName)!.push(parsed.data);
    }

    // Process each card
    for (const [creditCardName, transactions] of groupedByCard) {
      // Find or create card
      let card = await prisma.creditCard.findUnique({
        where: { name: creditCardName },
      });

      if (!card) {
        card = await prisma.creditCard.create({
          data: { name: creditCardName },
        });
      }

      // Check for duplicates and insert new transactions
      for (const tx of transactions) {
        const fingerprint = generateCreditCardTransactionFingerprint(
          tx.amount,
          tx.type,
          tx.transactionDate,
          tx.transactionDetails
        );

        const existing = await prisma.creditCardTransaction.findUnique({
          where: {
            creditCardId_fingerprint: {
              creditCardId: card.id,
              fingerprint,
            },
          },
        });

        if (existing) {
          duplicatesSkipped++;
        } else {
          await prisma.creditCardTransaction.create({
            data: {
              creditCardId: card.id,
              transactionDate: tx.transactionDate,
              transactionDetails: tx.transactionDetails,
              amount: tx.amount,
              type: tx.type,
              fingerprint,
            },
          });
          newTransactions++;
        }
      }
    }

    // Get transaction date range
    const creditCardNames = Array.from(groupedByCard.keys());
    let startDate: string | null = null;
    let endDate: string | null = null;

    if (creditCardNames.length > 0) {
      const cardTransactions = await prisma.creditCardTransaction.findMany({
        where: {
          creditCard: {
            name: {
              in: creditCardNames,
            },
          },
        },
        select: { transactionDate: true },
        orderBy: { transactionDate: 'asc' },
        take: 1,
      });

      const cardTransactionsMax = await prisma.creditCardTransaction.findMany({
        where: {
          creditCard: {
            name: {
              in: creditCardNames,
            },
          },
        },
        select: { transactionDate: true },
        orderBy: { transactionDate: 'desc' },
        take: 1,
      });

      if (cardTransactions.length > 0) {
        startDate = cardTransactions[0].transactionDate.toISOString().split('T')[0];
      }
      if (cardTransactionsMax.length > 0) {
        endDate = cardTransactionsMax[0].transactionDate.toISOString().split('T')[0];
      }
    }

    const firstCardName = Array.from(groupedByCard.keys())[0] || 'Unknown';
    const card = await prisma.creditCard.findUnique({
      where: { name: firstCardName },
    });

    return {
      success: true,
      accountId: card?.id || '',
      accountName: firstCardName,
      rowsProcessed,
      newTransactions,
      duplicatesSkipped,
      invalidRows,
      transactionPeriod: {
        startDate,
        endDate,
      },
    };
  } catch (error) {
    throw new Error(`Failed to import credit card statement: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
