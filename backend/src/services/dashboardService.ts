import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getDashboardSummary() {
  const [
    totalBankAccounts,
    totalCreditCards,
    bankTransactionCount,
    creditCardTransactionCount,
    latestBankTransaction,
    latestCreditCardTransaction,
    totalBalance,
  ] = await Promise.all([
    prisma.bankAccount.count(),
    prisma.creditCard.count(),
    prisma.bankTransaction.count(),
    prisma.creditCardTransaction.count(),
    prisma.bankTransaction.findFirst({
      orderBy: { transactionDate: 'desc' },
      select: { transactionDate: true },
    }),
    prisma.creditCardTransaction.findFirst({
      orderBy: { transactionDate: 'desc' },
      select: { transactionDate: true },
    }),
    prisma.bankTransaction.aggregate({
      _max: {
        balance: true,
      },
    }),
  ]);

  const latestTransactionDate = (() => {
    const dates = [];
    if (latestBankTransaction) {
      dates.push(latestBankTransaction.transactionDate);
    }
    if (latestCreditCardTransaction) {
      dates.push(latestCreditCardTransaction.transactionDate);
    }
    if (dates.length === 0) {
      return null;
    }
    return new Date(Math.max(...dates.map((d) => d.getTime()))).toISOString().split('T')[0];
  })();

  const totalTransactions = bankTransactionCount + creditCardTransactionCount;
  const totalBankBalance = totalBalance._max.balance || 0;

  // Calculate current period income and expenses (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [incomeData, expenseData, creditCardSpending] = await Promise.all([
    prisma.bankTransaction.aggregate({
      _sum: {
        creditAmount: true,
      },
      where: {
        transactionDate: {
          gte: thirtyDaysAgo,
        },
      },
    }),
    prisma.bankTransaction.aggregate({
      _sum: {
        debitAmount: true,
      },
      where: {
        transactionDate: {
          gte: thirtyDaysAgo,
        },
      },
    }),
    prisma.creditCardTransaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        transactionDate: {
          gte: thirtyDaysAgo,
        },
        type: 'Debit',
      },
    }),
  ]);

  const currentPeriodIncome = incomeData._sum.creditAmount || 0;
  const currentPeriodExpenses = expenseData._sum.debitAmount || 0;
  const creditCardSpendingAmount = creditCardSpending._sum.amount || 0;

  return {
    totalBankAccounts,
    totalCreditCards,
    totalTransactions,
    latestTransactionDate,
    totalBankBalance,
    currentPeriodIncome,
    currentPeriodExpenses,
    creditCardSpending: creditCardSpendingAmount,
  };
}
