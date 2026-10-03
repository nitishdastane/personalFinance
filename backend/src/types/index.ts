export interface BankCSVRow {
  'Bank Name': string;
  'Transaction Date': string;
  'Transaction Details': string;
  'Debit Amount': string;
  'Credit Amount': string;
  Balance: string;
}

export interface CreditCardCSVRow {
  'Credit Card Name': string;
  'Transaction Date': string;
  'Transaction Details': string;
  Amount: string;
  Type: string;
}

export interface ParsedBankTransaction {
  bankName: string;
  transactionDate: Date;
  transactionDetails: string;
  debitAmount: number | null;
  creditAmount: number | null;
  balance: number;
}

export interface ParsedCreditCardTransaction {
  creditCardName: string;
  transactionDate: Date;
  transactionDetails: string;
  amount: number;
  type: string;
}

export interface ValidationError {
  rowNumber: number;
  field: string;
  value: string;
  error: string;
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

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: ValidationError[];
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
}

export interface TransactionFilters {
  accountId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  type?: string;
  minAmount?: number;
  maxAmount?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}
