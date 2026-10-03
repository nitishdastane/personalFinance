import { PrismaClient, Prisma } from '@prisma/client';
import { TransactionFilters } from '../types/index';

const prisma = new PrismaClient();

export async function getBankTransactions(filters: TransactionFilters) {
  const {
    accountId,
    startDate,
    endDate,
    search,
    type,
    minAmount,
    maxAmount,
    sortBy = 'transactionDate',
    sortOrder = 'desc',
    page = 1,
    pageSize = 50,
  } = filters;

  if (!accountId) {
    throw new Error('accountId is required');
  }

  const where: Prisma.BankTransactionWhereInput = {
    bankAccountId: accountId,
  };

  if (startDate) {
    where.transactionDate = where.transactionDate || {};
    where.transactionDate = {
      ...where.transactionDate,
      gte: new Date(startDate),
    };
  }

  if (endDate) {
    where.transactionDate = where.transactionDate || {};
    where.transactionDate = {
      ...where.transactionDate,
      lte: new Date(endDate),
    };
  }

  if (search) {
    where.transactionDetails = {
      contains: search,
      mode: 'insensitive',
    };
  }

  if (type) {
    if (type.toLowerCase() === 'debit') {
      where.debitAmount = { gt: 0 };
    } else if (type.toLowerCase() === 'credit') {
      where.creditAmount = { gt: 0 };
    }
  }

  if (minAmount !== undefined) {
    where.OR = where.OR || [];
    where.OR.push(
      { debitAmount: { gte: minAmount } },
      { creditAmount: { gte: minAmount } }
    );
  }

  if (maxAmount !== undefined) {
    where.AND = where.AND || [];
    where.AND.push({
      OR: [
        { debitAmount: { lte: maxAmount } },
        { creditAmount: { lte: maxAmount } },
        { debitAmount: null },
        { creditAmount: null },
      ],
    });
  }

  const orderBy: Prisma.BankTransactionOrderByWithRelationInput = {};
  if (sortBy === 'amount') {
    orderBy.debitAmount = sortOrder as Prisma.SortOrder;
  } else if (sortBy === 'balance') {
    orderBy.balance = sortOrder as Prisma.SortOrder;
  } else {
    orderBy.transactionDate = sortOrder as Prisma.SortOrder;
  }

  const skip = (page - 1) * pageSize;

  const [transactions, total] = await Promise.all([
    prisma.bankTransaction.findMany({
      where,
      select: {
        id: true,
        transactionDate: true,
        transactionDetails: true,
        debitAmount: true,
        creditAmount: true,
        balance: true,
      },
      orderBy,
      skip,
      take: pageSize,
    }),
    prisma.bankTransaction.count({ where }),
  ]);

  const enrichedTransactions = transactions.map((tx) => ({
    ...tx,
    transactionDate: tx.transactionDate.toISOString().split('T')[0],
  }));

  return {
    data: enrichedTransactions,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}

export async function getCreditCardTransactions(filters: TransactionFilters) {
  const {
    accountId,
    startDate,
    endDate,
    search,
    type,
    minAmount,
    maxAmount,
    sortBy = 'transactionDate',
    sortOrder = 'desc',
    page = 1,
    pageSize = 50,
  } = filters;

  if (!accountId) {
    throw new Error('accountId is required');
  }

  const where: Prisma.CreditCardTransactionWhereInput = {
    creditCardId: accountId,
  };

  if (startDate) {
    where.transactionDate = where.transactionDate || {};
    where.transactionDate = {
      ...where.transactionDate,
      gte: new Date(startDate),
    };
  }

  if (endDate) {
    where.transactionDate = where.transactionDate || {};
    where.transactionDate = {
      ...where.transactionDate,
      lte: new Date(endDate),
    };
  }

  if (search) {
    where.transactionDetails = {
      contains: search,
      mode: 'insensitive',
    };
  }

  if (type) {
    where.type = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  }

  if (minAmount !== undefined) {
    where.amount = where.amount || {};
    where.amount = {
      ...where.amount,
      gte: minAmount,
    };
  }

  if (maxAmount !== undefined) {
    where.amount = where.amount || {};
    where.amount = {
      ...where.amount,
      lte: maxAmount,
    };
  }

  const orderBy: Prisma.CreditCardTransactionOrderByWithRelationInput = {};
  if (sortBy === 'amount') {
    orderBy.amount = sortOrder as Prisma.SortOrder;
  } else {
    orderBy.transactionDate = sortOrder as Prisma.SortOrder;
  }

  const skip = (page - 1) * pageSize;

  const [transactions, total] = await Promise.all([
    prisma.creditCardTransaction.findMany({
      where,
      select: {
        id: true,
        transactionDate: true,
        transactionDetails: true,
        amount: true,
        type: true,
      },
      orderBy,
      skip,
      take: pageSize,
    }),
    prisma.creditCardTransaction.count({ where }),
  ]);

  const enrichedTransactions = transactions.map((tx) => ({
    ...tx,
    transactionDate: tx.transactionDate.toISOString().split('T')[0],
  }));

  return {
    data: enrichedTransactions,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}
