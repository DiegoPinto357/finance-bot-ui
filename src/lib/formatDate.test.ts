import { formatMonthYear, monthYearStringToDate } from './formatDate';

describe('formatDate', () => {
  describe('formatMonthYear', () => {
    it('formats YYYY-MM string to short month and year', () => {
      // These expected values may vary by system locale, but for 'default' they are usually:
      expect(formatMonthYear('2025-08')).toBe('Aug 2025');
      expect(formatMonthYear('2023-01')).toBe('Jan 2023');
    });

    it('returns empty string for empty input', () => {
      expect(formatMonthYear('')).toBe('');
    });
  });

  describe('monthYearStringToDate', () => {
    it('converts YYYY-MM string to Date object', () => {
      expect(monthYearStringToDate('2025-08')).toEqual(new Date('2025-08-01'));
      expect(monthYearStringToDate('2023-01')).toEqual(new Date('2023-01-01'));
    });

    it('returns undefined for empty input', () => {
      expect(monthYearStringToDate('')).toBeUndefined();
    });
  });
});
