-- Add Transfer Pattern and Transfer Match Tables
-- Enables automatic detection of internal transfers between accounts

-- CreateTable TransferPattern
CREATE TABLE "TransferPattern" (
    "id" TEXT NOT NULL,
    "pattern" TEXT NOT NULL,
    "targetBankName" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransferPattern_pkey" PRIMARY KEY ("id")
);

-- CreateTable TransferMatch
CREATE TABLE "TransferMatch" (
    "id" TEXT NOT NULL,
    "sourceBankAccountId" TEXT NOT NULL,
    "sourceTransactionId" TEXT NOT NULL,
    "targetBankAccountId" TEXT NOT NULL,
    "targetTransactionId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL,
    "patternMatched" TEXT,
    "detectionMethod" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransferMatch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex - Unique constraint on pattern
CREATE UNIQUE INDEX "TransferPattern_pattern_key" ON "TransferPattern"("pattern");

-- CreateIndex - Index for active status
CREATE INDEX "TransferPattern_isActive_idx" ON "TransferPattern"("isActive");

-- CreateIndex - Unique constraint on transfer pair
CREATE UNIQUE INDEX "TransferMatch_sourceTransactionId_targetTransactionId_key" ON "TransferMatch"("sourceTransactionId", "targetTransactionId");

-- CreateIndex - Indexes for lookups
CREATE INDEX "TransferMatch_sourceBankAccountId_idx" ON "TransferMatch"("sourceBankAccountId");
CREATE INDEX "TransferMatch_targetBankAccountId_idx" ON "TransferMatch"("targetBankAccountId");
CREATE INDEX "TransferMatch_transactionDate_idx" ON "TransferMatch"("transactionDate");
