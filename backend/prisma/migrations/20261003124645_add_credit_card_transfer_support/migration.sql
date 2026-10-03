-- AlterTable
ALTER TABLE "TransferMatch" ADD COLUMN     "targetBankAccountId2" TEXT,
ADD COLUMN     "targetCreditCardId" TEXT,
ALTER COLUMN "sourceBankAccountId" DROP NOT NULL,
ALTER COLUMN "targetBankAccountId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "TransferMatch_targetBankAccountId2_idx" ON "TransferMatch"("targetBankAccountId2");

-- CreateIndex
CREATE INDEX "TransferMatch_targetCreditCardId_idx" ON "TransferMatch"("targetCreditCardId");

-- AddForeignKey
ALTER TABLE "TransferMatch" ADD CONSTRAINT "TransferMatch_targetBankAccountId2_fkey" FOREIGN KEY ("targetBankAccountId2") REFERENCES "BankAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferMatch" ADD CONSTRAINT "TransferMatch_targetCreditCardId_fkey" FOREIGN KEY ("targetCreditCardId") REFERENCES "CreditCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
