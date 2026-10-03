import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface TransferDetectionResult {
  found: number;
  matched: Array<{
    sourceTransactionId: string;
    targetTransactionId: string;
    sourceAccount: string;
    targetAccount: string;
    amount: number;
    date: string;
    method: string;
  }>;
}

export async function detectTransfers(): Promise<TransferDetectionResult> {
  const result: TransferDetectionResult = {
    found: 0,
    matched: [],
  };

  try {
    // Get all active transfer patterns
    const patterns = await prisma.transferPattern.findMany({
      where: { isActive: true },
    });

    // Get Transfer category
    const transferCategory = await prisma.category.findFirst({
      where: { name: 'Account to Account' },
    });

    if (!transferCategory) {
      throw new Error('Transfer category not found');
    }

    // Get all bank transactions that are debits (credit amount is null or zero)
    const bankTransactions = await prisma.bankTransaction.findMany({
      include: { bankAccount: true },
    });

    const matchedTransactionIds = new Set<string>();

    // For each transaction, check if it matches any pattern
    for (const transaction of bankTransactions) {
      if (matchedTransactionIds.has(transaction.id)) continue;

      const debitAmount = transaction.debitAmount || 0;
      if (debitAmount <= 0) continue; // Skip non-debit transactions

      const details = transaction.transactionDetails || '';

      // Check each pattern (case-insensitive)
      for (const pattern of patterns) {
        if (details.toUpperCase().includes(pattern.pattern.toUpperCase())) {
          // Found a matching pattern
          // Now find the target account based on the bank name
          const targetAccount = await prisma.bankAccount.findFirst({
            where: {
              name: {
                contains: pattern.targetBankName,
                mode: 'insensitive',
              },
            },
          });

          if (!targetAccount) {
            console.log(
              `Target account not found for pattern: ${pattern.pattern}`
            );
            continue;
          }

          // Look for matching credit transaction in target account on same day
          const targetTransaction = await prisma.bankTransaction.findFirst({
            where: {
              bankAccountId: targetAccount.id,
              transactionDate: transaction.transactionDate,
              creditAmount: debitAmount,
            },
            include: { bankAccount: true },
          });

          if (!targetTransaction) {
            console.log(
              `No matching credit transaction found for amount ${debitAmount} on ${transaction.transactionDate}`
            );
            continue;
          }

          // Found a transfer pair!
          // Create transfer match record (or skip if already exists)
          try {
            await prisma.transferMatch.create({
              data: {
                sourceBankAccountId: transaction.bankAccountId,
                sourceTransactionId: transaction.id,
                targetBankAccountId: targetAccount.id,
                targetTransactionId: targetTransaction.id,
                amount: debitAmount,
                transactionDate: transaction.transactionDate,
                patternMatched: pattern.pattern,
                detectionMethod: 'pattern',
              },
            });
          } catch (e: any) {
            // Skip if already exists (unique constraint)
            if (e.code !== 'P2002') {
              throw e;
            }
          }

          // TODO: Update both transactions with Transfer category
          // Note: We can't directly update category on transaction without a categoryId field
          // For now, we'll just record the match

          result.matched.push({
            sourceTransactionId: transaction.id,
            targetTransactionId: targetTransaction.id,
            sourceAccount: transaction.bankAccount.name,
            targetAccount: targetAccount.name,
            amount: debitAmount,
            date: transaction.transactionDate.toISOString().split('T')[0],
            method: 'pattern',
          });

          matchedTransactionIds.add(transaction.id);
          matchedTransactionIds.add(targetTransaction.id);
          result.found++;
          break; // Move to next transaction after finding match
        }
      }
    }

    // Credit card payment detection
    // Match bank transactions with "SBI Cards and Payment" to credit card "PAYMENT RECEIVED" transactions
    const bankTransactionsForCC = await prisma.bankTransaction.findMany({
      include: { bankAccount: true },
    });

    const creditCardTransactions = await prisma.creditCardTransaction.findMany({
      include: { creditCard: true },
    });

    for (const bankTx of bankTransactionsForCC) {
      if (matchedTransactionIds.has(bankTx.id)) continue;

      const debitAmount = bankTx.debitAmount || 0;
      if (debitAmount <= 0) continue;

      const details = bankTx.transactionDetails || '';

      // Check if this is a credit card payment (case-insensitive)
      if (details.toUpperCase().includes('SBI CARDS AND PAYMENT')) {
        // Look for matching credit card payment received transaction
        const matchingCCTx = creditCardTransactions.find(
          ccTx =>
            ccTx.transactionDate.getTime() === bankTx.transactionDate.getTime() &&
            ccTx.amount === debitAmount &&
            (ccTx.transactionDetails?.includes('PAYMENT RECEIVED') ||
              ccTx.transactionDetails?.includes('Payment'))
        );

        if (matchingCCTx) {
          try {
            await prisma.transferMatch.create({
              data: {
                sourceBankAccountId: bankTx.bankAccountId,
                sourceTransactionId: bankTx.id,
                targetBankAccountId2: bankTx.bankAccountId,
                targetCreditCardId: matchingCCTx.creditCardId,
                targetTransactionId: matchingCCTx.id,
                amount: debitAmount,
                transactionDate: bankTx.transactionDate,
                detectionMethod: 'credit_card_payment',
                patternMatched: 'SBI Cards and Payment',
              },
            });

            result.matched.push({
              sourceTransactionId: bankTx.id,
              targetTransactionId: matchingCCTx.id,
              sourceAccount: bankTx.bankAccount.name,
              targetAccount: matchingCCTx.creditCard?.name || 'Credit Card',
              amount: debitAmount,
              date: bankTx.transactionDate.toISOString().split('T')[0],
              method: 'credit_card_payment',
            });

            matchedTransactionIds.add(bankTx.id);
            matchedTransactionIds.add(matchingCCTx.id);
            result.found++;
          } catch (e: any) {
            if (e.code !== 'P2002') {
              throw e;
            }
          }
        }
      }
    }

    return result;
  } catch (error) {
    console.error('Error detecting transfers:', error);
    throw error;
  }
}

export async function getTransferPatterns() {
  return await prisma.transferPattern.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'asc' },
  });
}

export async function addTransferPattern(
  pattern: string,
  targetBankName: string,
  description?: string
) {
  return await prisma.transferPattern.create({
    data: {
      pattern,
      targetBankName,
      description,
      isActive: true,
    },
  });
}

export async function updateTransferPattern(
  id: string,
  data: {
    pattern?: string;
    targetBankName?: string;
    description?: string;
    isActive?: boolean;
  }
) {
  return await prisma.transferPattern.update({
    where: { id },
    data,
  });
}

export async function deleteTransferPattern(id: string) {
  return await prisma.transferPattern.delete({
    where: { id },
  });
}
