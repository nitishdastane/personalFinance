-- AlterTable
ALTER TABLE "BankTransaction" ADD COLUMN     "categoryId" TEXT;

-- AlterTable
ALTER TABLE "CreditCardTransaction" ADD COLUMN     "categoryId" TEXT;

-- CreateIndex
CREATE INDEX "BankTransaction_categoryId_idx" ON "BankTransaction"("categoryId");

-- CreateIndex
CREATE INDEX "CreditCardTransaction_categoryId_idx" ON "CreditCardTransaction"("categoryId");
