export interface BankAccount {
  id: string;
  name: string;
  transactionCount: number;
  startDate: string | null;
  endDate: string | null;
  latestBalance: number | null;
  lastImportedAt: string | null;
}

export interface CreditCard {
  id: string;
  name: string;
  transactionCount: number;
  startDate: string | null;
  endDate: string | null;
  lastImportedAt: string | null;
}

export interface BankTransaction {
  id: string;
  transactionDate: string;
  transactionDetails: string;
  debitAmount: number | null;
  creditAmount: number | null;
  balance: number;
}

export interface CreditCardTransaction {
  id: string;
  transactionDate: string;
  transactionDetails: string;
  amount: number;
  type: string;
}

export interface ImportSummary {
  success: boolean;
  accountId: string;
  accountName: string;
  rowsProcessed: number;
  newTransactions: number;
  duplicatesSkipped: number;
  invalidRows: ValidationError[];
  transactionPeriod: {
    startDate: string | null;
    endDate: string | null;
  };
}

export interface ValidationError {
  rowNumber: number;
  field: string;
  value: string;
  error: string;
}

export interface DashboardSummary {
  totalBankAccounts: number;
  totalCreditCards: number;
  totalTransactions: number;
  latestTransactionDate: string | null;
  totalBankBalance: number;
  currentPeriodIncome: number;
  currentPeriodExpenses: number;
  creditCardSpending: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
