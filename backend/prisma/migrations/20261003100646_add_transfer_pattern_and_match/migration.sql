-- CreateTable
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

-- CreateTable
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

-- CreateIndex
CREATE UNIQUE INDEX "TransferPattern_pattern_key" ON "TransferPattern"("pattern");

-- CreateIndex
CREATE INDEX "TransferPattern_isActive_idx" ON "TransferPattern"("isActive");

-- CreateIndex
CREATE INDEX "TransferMatch_sourceBankAccountId_idx" ON "TransferMatch"("sourceBankAccountId");

-- CreateIndex
CREATE INDEX "TransferMatch_targetBankAccountId_idx" ON "TransferMatch"("targetBankAccountId");

-- CreateIndex
CREATE INDEX "TransferMatch_transactionDate_idx" ON "TransferMatch"("transactionDate");

-- CreateIndex
CREATE UNIQUE INDEX "TransferMatch_sourceTransactionId_targetTransactionId_key" ON "TransferMatch"("sourceTransactionId", "targetTransactionId");
