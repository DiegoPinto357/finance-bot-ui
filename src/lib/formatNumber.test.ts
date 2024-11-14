import {
  formatPrecision,
  formatCurrency,
  formatPercentage,
} from './formatNumber';

describe('formatNumber', () => {
  describe('formatPrecision', () => {
    it('formats a number to a precision of 5', () => {
      expect(formatPrecision(123.456789)).toBe('123.46');
      expect(formatPrecision(0.000123456789)).toBe('0.00012346');
    });
  });

  describe('formatCurrency', () => {
    it('formats a number as Brazilian currency', () => {
      expect(formatCurrency(1234.56)).toBe('R$ 1.234,56');
    });

    it('returns an empty string for undefined value', () => {
      expect(formatCurrency(undefined)).toBe('');
    });

    it('returns an empty string for zero when allowZero is false', () => {
      expect(formatCurrency(0)).toBe('');
    });

    it('formats 0 as currency when allowZero is true', () => {
      expect(formatCurrency(0, true)).toBe('R$ 0,00');
    });

    it('handles negative numbers correctly', () => {
      expect(formatCurrency(-1234.56)).toBe('-R$ 1.234,56');
    });
  });

  describe('formatPercentage', () => {
    it('formats a number as a percentage with two decimal places', () => {
      expect(formatPercentage(0.1234)).toBe('12,34%');
      expect(formatPercentage(1)).toBe('100,00%');
    });
  });
});
