-- Initial Database Schema
-- Creates tables for Bank Accounts, Credit Cards, and Transactions

-- CreateTable BankAccount
CREATE TABLE "BankAccount" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable CreditCard
CREATE TABLE "CreditCard" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreditCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable BankTransaction
CREATE TABLE "BankTransaction" (
    "id" TEXT NOT NULL,
    "bankAccountId" TEXT NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL,
    "transactionDetails" TEXT NOT NULL,
    "debitAmount" DOUBLE PRECISION,
    "creditAmount" DOUBLE PRECISION,
    "balance" DOUBLE PRECISION NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BankTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable CreditCardTransaction
CREATE TABLE "CreditCardTransaction" (
    "id" TEXT NOT NULL,
    "creditCardId" TEXT NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL,
    "transactionDetails" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreditCardTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex - Unique constraints
CREATE UNIQUE INDEX "BankAccount_name_key" ON "BankAccount"("name");
CREATE UNIQUE INDEX "CreditCard_name_key" ON "CreditCard"("name");
CREATE UNIQUE INDEX "BankTransaction_bankAccountId_fingerprint_key" ON "BankTransaction"("bankAccountId", "fingerprint");
CREATE UNIQUE INDEX "CreditCardTransaction_creditCardId_fingerprint_key" ON "CreditCardTransaction"("creditCardId", "fingerprint");

-- CreateIndex - Query optimization indexes
CREATE INDEX "BankTransaction_bankAccountId_idx" ON "BankTransaction"("bankAccountId");
CREATE INDEX "BankTransaction_transactionDate_idx" ON "BankTransaction"("transactionDate");
CREATE INDEX "CreditCardTransaction_creditCardId_idx" ON "CreditCardTransaction"("creditCardId");
CREATE INDEX "CreditCardTransaction_transactionDate_idx" ON "CreditCardTransaction"("transactionDate");

-- AddForeignKey - Relationships
ALTER TABLE "BankTransaction" ADD CONSTRAINT "BankTransaction_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "BankAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CreditCardTransaction" ADD CONSTRAINT "CreditCardTransaction_creditCardId_fkey" FOREIGN KEY ("creditCardId") REFERENCES "CreditCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
