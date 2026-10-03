import crypto from 'crypto';

export function generateBankTransactionFingerprint(
  debitAmount: number | null,
  creditAmount: number | null,
  balance: number,
  transactionDate: Date,
  transactionDetails: string
): string {
  const components = [
    transactionDate.toISOString().split('T')[0], // Date in YYYY-MM-DD format
    transactionDetails.trim().toLowerCase(),
    debitAmount !== null ? debitAmount.toString() : '',
    creditAmount !== null ? creditAmount.toString() : '',
    balance.toString(),
  ].join('|');

  return crypto.createHash('sha256').update(components).digest('hex');
}

export function generateCreditCardTransactionFingerprint(
  amount: number,
  type: string,
  transactionDate: Date,
  transactionDetails: string
): string {
  const components = [
    transactionDate.toISOString().split('T')[0], // Date in YYYY-MM-DD format
    transactionDetails.trim().toLowerCase(),
    amount.toString(),
    type.trim().toLowerCase(),
  ].join('|');

  return crypto.createHash('sha256').update(components).digest('hex');
}
