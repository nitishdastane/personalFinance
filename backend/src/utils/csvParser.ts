import { parse } from 'csv-parse/sync';
import { BankCSVRow, CreditCardCSVRow, ParsedBankTransaction, ParsedCreditCardTransaction, ValidationError } from '../types/index';

export function parseCSVContent(content: string): Record<string, string>[] {
  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
  return records;
}

export function normalizeCurrency(value: string): number {
  if (!value || value.trim() === '') {
    return 0;
  }
  // Remove currency symbols and commas
  const normalized = value.replace(/[$,₹₨€¥]/g, '').trim();
  const parsed = parseFloat(normalized);
  return isNaN(parsed) ? 0 : parsed;
}

export function parseDate(dateStr: string): Date | null {
  if (!dateStr || dateStr.trim() === '') {
    return null;
  }

  // Try YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  // Try MM/DD/YYYY format
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
    const parts = dateStr.split('/');
    const date = new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  // Try DD-MM-YYYY format
  if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(dateStr)) {
    const parts = dateStr.split('-');
    const date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  return null;
}

export function validateBankCSVHeaders(headers: string[]): { valid: boolean; missing: string[] } {
  const required = ['Bank Name', 'Transaction Date', 'Transaction Details', 'Debit Amount', 'Credit Amount', 'Balance'];
  const missing = required.filter(h => !headers.includes(h));
  return {
    valid: missing.length === 0,
    missing,
  };
}

export function validateCreditCardCSVHeaders(headers: string[]): { valid: boolean; missing: string[] } {
  const required = ['Credit Card Name', 'Transaction Date', 'Transaction Details', 'Amount', 'Type'];
  const missing = required.filter(h => !headers.includes(h));
  return {
    valid: missing.length === 0,
    missing,
  };
}

export function parseBankTransaction(row: Record<string, string>, rowNumber: number): { data: ParsedBankTransaction | null; error: ValidationError | null } {
  const errors: ValidationError[] = [];

  const bankName = (row['Bank Name'] || '').trim();
  if (!bankName) {
    errors.push({
      rowNumber,
      field: 'Bank Name',
      value: row['Bank Name'] || '',
      error: 'Bank Name is required',
    });
  }

  const transactionDetails = (row['Transaction Details'] || '').trim();
  if (!transactionDetails) {
    errors.push({
      rowNumber,
      field: 'Transaction Details',
      value: row['Transaction Details'] || '',
      error: 'Transaction Details is required',
    });
  }

  const transactionDate = parseDate(row['Transaction Date']);
  if (!transactionDate) {
    errors.push({
      rowNumber,
      field: 'Transaction Date',
      value: row['Transaction Date'] || '',
      error: 'Invalid date format. Expected YYYY-MM-DD or MM/DD/YYYY',
    });
  }

  const debitAmount = row['Debit Amount']?.trim() ? normalizeCurrency(row['Debit Amount']) : null;
  if (row['Debit Amount']?.trim() && isNaN(debitAmount!)) {
    errors.push({
      rowNumber,
      field: 'Debit Amount',
      value: row['Debit Amount'],
      error: 'Debit Amount must be a valid number',
    });
  }

  const creditAmount = row['Credit Amount']?.trim() ? normalizeCurrency(row['Credit Amount']) : null;
  if (row['Credit Amount']?.trim() && isNaN(creditAmount!)) {
    errors.push({
      rowNumber,
      field: 'Credit Amount',
      value: row['Credit Amount'],
      error: 'Credit Amount must be a valid number',
    });
  }

  const balance = normalizeCurrency(row['Balance']);
  if (!row['Balance']?.trim() || isNaN(balance)) {
    errors.push({
      rowNumber,
      field: 'Balance',
      value: row['Balance'] || '',
      error: 'Balance must be a valid number',
    });
  }

  if (errors.length > 0) {
    return { data: null, error: errors[0] };
  }

  return {
    data: {
      bankName,
      transactionDate: transactionDate!,
      transactionDetails,
      debitAmount: debitAmount && debitAmount > 0 ? debitAmount : null,
      creditAmount: creditAmount && creditAmount > 0 ? creditAmount : null,
      balance,
    },
    error: null,
  };
}

export function parseCreditCardTransaction(row: Record<string, string>, rowNumber: number): { data: ParsedCreditCardTransaction | null; error: ValidationError | null } {
  const errors: ValidationError[] = [];

  const creditCardName = (row['Credit Card Name'] || '').trim();
  if (!creditCardName) {
    errors.push({
      rowNumber,
      field: 'Credit Card Name',
      value: row['Credit Card Name'] || '',
      error: 'Credit Card Name is required',
    });
  }

  const transactionDetails = (row['Transaction Details'] || '').trim();
  if (!transactionDetails) {
    errors.push({
      rowNumber,
      field: 'Transaction Details',
      value: row['Transaction Details'] || '',
      error: 'Transaction Details is required',
    });
  }

  const transactionDate = parseDate(row['Transaction Date']);
  if (!transactionDate) {
    errors.push({
      rowNumber,
      field: 'Transaction Date',
      value: row['Transaction Date'] || '',
      error: 'Invalid date format. Expected YYYY-MM-DD or MM/DD/YYYY',
    });
  }

  const amount = normalizeCurrency(row['Amount']);
  if (!row['Amount']?.trim() || isNaN(amount)) {
    errors.push({
      rowNumber,
      field: 'Amount',
      value: row['Amount'] || '',
      error: 'Amount must be a valid number',
    });
  }

  const type = (row['Type'] || '').trim().toLowerCase();
  if (!type || !['debit', 'credit'].includes(type)) {
    errors.push({
      rowNumber,
      field: 'Type',
      value: row['Type'] || '',
      error: 'Type must be either "Debit" or "Credit"',
    });
  }

  if (errors.length > 0) {
    return { data: null, error: errors[0] };
  }

  return {
    data: {
      creditCardName,
      transactionDate: transactionDate!,
      transactionDetails,
      amount,
      type: type.charAt(0).toUpperCase() + type.slice(1),
    },
    error: null,
  };
}
