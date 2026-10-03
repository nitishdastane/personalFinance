import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getBankAccounts(limit: number = 50, offset: number = 0) {
  const accounts = await prisma.bankAccount.findMany({
    skip: offset,
    take: limit,
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const enrichedAccounts = await Promise.all(
    accounts.map(async (account) => {
      const transactions = await prisma.bankTransaction.findMany({
        where: { bankAccountId: account.id },
        select: {
          transactionDate: true,
          balance: true,
        },
        orderBy: { transactionDate: 'asc' },
      });

      const transactionCount = transactions.length;
      const startDate = transactions.length > 0 ? transactions[0].transactionDate : null;
      const endDate = transactions.length > 0 ? transactions[transactions.length - 1].transactionDate : null;
      const latestBalance = transactions.length > 0 ? transactions[transactions.length - 1].balance : null;

      const lastTransaction = await prisma.bankTransaction.findFirst({
        where: { bankAccountId: account.id },
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      });

      return {
        id: account.id,
        name: account.name,
        transactionCount,
        startDate: startDate?.toISOString().split('T')[0] || null,
        endDate: endDate?.toISOString().split('T')[0] || null,
        latestBalance,
        lastImportedAt: lastTransaction?.createdAt || null,
      };
    })
  );

  const total = await prisma.bankAccount.count();

  return {
    data: enrichedAccounts,
    total,
    limit,
    offset,
  };
}

export async function getBankAccountById(id: string) {
  const account = await prisma.bankAccount.findUnique({
    where: { id },
  });

  if (!account) {
    return null;
  }

  const transactions = await prisma.bankTransaction.findMany({
    where: { bankAccountId: id },
    select: {
      transactionDate: true,
      balance: true,
    },
    orderBy: { transactionDate: 'asc' },
  });

  const transactionCount = transactions.length;
  const startDate = transactions.length > 0 ? transactions[0].transactionDate : null;
  const endDate = transactions.length > 0 ? transactions[transactions.length - 1].transactionDate : null;
  const latestBalance = transactions.length > 0 ? transactions[transactions.length - 1].balance : null;

  const lastTransaction = await prisma.bankTransaction.findFirst({
    where: { bankAccountId: id },
    orderBy: { createdAt: 'desc' },
    select: { createdAt: true },
  });

  return {
    id: account.id,
    name: account.name,
    transactionCount,
    startDate: startDate?.toISOString().split('T')[0] || null,
    endDate: endDate?.toISOString().split('T')[0] || null,
    latestBalance,
    lastImportedAt: lastTransaction?.createdAt || null,
  };
}

export async function getCreditCards(limit: number = 50, offset: number = 0) {
  const cards = await prisma.creditCard.findMany({
    skip: offset,
    take: limit,
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const enrichedCards = await Promise.all(
    cards.map(async (card) => {
      const transactions = await prisma.creditCardTransaction.findMany({
        where: { creditCardId: card.id },
        select: {
          transactionDate: true,
        },
        orderBy: { transactionDate: 'asc' },
      });

      const transactionCount = transactions.length;
      const startDate = transactions.length > 0 ? transactions[0].transactionDate : null;
      const endDate = transactions.length > 0 ? transactions[transactions.length - 1].transactionDate : null;

      const lastTransaction = await prisma.creditCardTransaction.findFirst({
        where: { creditCardId: card.id },
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      });

      return {
        id: card.id,
        name: card.name,
        transactionCount,
        startDate: startDate?.toISOString().split('T')[0] || null,
        endDate: endDate?.toISOString().split('T')[0] || null,
        lastImportedAt: lastTransaction?.createdAt || null,
      };
    })
  );

  const total = await prisma.creditCard.count();

  return {
    data: enrichedCards,
    total,
    limit,
    offset,
  };
}

export async function getCreditCardById(id: string) {
  const card = await prisma.creditCard.findUnique({
    where: { id },
  });

  if (!card) {
    return null;
  }

  const transactions = await prisma.creditCardTransaction.findMany({
    where: { creditCardId: id },
    select: {
      transactionDate: true,
    },
    orderBy: { transactionDate: 'asc' },
  });

  const transactionCount = transactions.length;
  const startDate = transactions.length > 0 ? transactions[0].transactionDate : null;
  const endDate = transactions.length > 0 ? transactions[transactions.length - 1].transactionDate : null;

  const lastTransaction = await prisma.creditCardTransaction.findFirst({
    where: { creditCardId: id },
    orderBy: { createdAt: 'desc' },
    select: { createdAt: true },
  });

  return {
    id: card.id,
    name: card.name,
    transactionCount,
    startDate: startDate?.toISOString().split('T')[0] || null,
    endDate: endDate?.toISOString().split('T')[0] || null,
    lastImportedAt: lastTransaction?.createdAt || null,
  };
}
