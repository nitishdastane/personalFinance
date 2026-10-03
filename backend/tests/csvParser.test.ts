import {
  parseDate,
  normalizeCurrency,
  validateBankCSVHeaders,
  validateCreditCardCSVHeaders,
  parseBankTransaction,
  parseCreditCardTransaction,
} from '../src/utils/csvParser';

describe('CSV Parser Utils', () => {
  describe('parseDate', () => {
    it('should parse YYYY-MM-DD format', () => {
      const date = parseDate('2026-01-15');
      expect(date).not.toBeNull();
      expect(date?.getFullYear()).toBe(2026);
      expect(date?.getMonth()).toBe(0);
      expect(date?.getDate()).toBe(15);
    });

    it('should parse MM/DD/YYYY format', () => {
      const date = parseDate('01/15/2026');
      expect(date).not.toBeNull();
      expect(date?.getFullYear()).toBe(2026);
    });

    it('should return null for invalid date', () => {
      const date = parseDate('invalid-date');
      expect(date).toBeNull();
    });
  });

  describe('normalizeCurrency', () => {
    it('should parse simple numbers', () => {
      expect(normalizeCurrency('1000')).toBe(1000);
    });

    it('should handle currency symbols', () => {
      expect(normalizeCurrency('₹1000')).toBe(1000);
      expect(normalizeCurrency('$1000')).toBe(1000);
    });

    it('should handle commas', () => {
      expect(normalizeCurrency('1,000.50')).toBe(1000.50);
    });

    it('should return 0 for empty string', () => {
      expect(normalizeCurrency('')).toBe(0);
    });
  });

  describe('validateBankCSVHeaders', () => {
    it('should validate correct headers', () => {
      const headers = [
        'Bank Name',
        'Transaction Date',
        'Transaction Details',
        'Debit Amount',
        'Credit Amount',
        'Balance',
      ];
      const result = validateBankCSVHeaders(headers);
      expect(result.valid).toBe(true);
      expect(result.missing).toHaveLength(0);
    });

    it('should identify missing headers', () => {
      const headers = ['Bank Name', 'Transaction Date'];
      const result = validateBankCSVHeaders(headers);
      expect(result.valid).toBe(false);
      expect(result.missing.length).toBeGreaterThan(0);
    });
  });

  describe('parseBankTransaction', () => {
    it('should parse valid transaction', () => {
      const row = {
        'Bank Name': 'HDFC Bank',
        'Transaction Date': '2026-01-15',
        'Transaction Details': 'ATM Withdrawal',
        'Debit Amount': '5000',
        'Credit Amount': '',
        'Balance': '50000',
      };
      const result = parseBankTransaction(row, 1);
      expect(result.error).toBeNull();
      expect(result.data).not.toBeNull();
      expect(result.data?.bankName).toBe('HDFC Bank');
      expect(result.data?.debitAmount).toBe(5000);
    });

    it('should catch invalid date', () => {
      const row = {
        'Bank Name': 'HDFC Bank',
        'Transaction Date': 'invalid',
        'Transaction Details': 'ATM Withdrawal',
        'Debit Amount': '5000',
        'Credit Amount': '',
        'Balance': '50000',
      };
      const result = parseBankTransaction(row, 1);
      expect(result.error).not.toBeNull();
      expect(result.error?.field).toBe('Transaction Date');
    });
  });
});
