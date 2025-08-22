import { formatMonthYear, monthYearStringToDate } from './formatDate';
import { getNextMonthString } from './formatDate';

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
      const date1 = monthYearStringToDate('2025-08');
      expect(date1?.getFullYear()).toBe(2025);
      expect(date1?.getMonth()).toBe(7); // August is month 7 (0-indexed)
      expect(date1?.getDate()).toBe(1);

      const date2 = monthYearStringToDate('2023-01');
      expect(date2?.getFullYear()).toBe(2023);
      expect(date2?.getMonth()).toBe(0); // January is month 0
      expect(date2?.getDate()).toBe(1);
    });

    it('returns undefined for empty input', () => {
      expect(monthYearStringToDate('')).toBeUndefined();
    });
  });

  describe('getNextMonthString', () => {
    it('returns next month in YYYY-MM format for current date', () => {
      const now = new Date(2025, 7, 22);
      expect(getNextMonthString(now)).toBe('2025-09');
    });

    it('handles December correctly (rolls over to next year)', () => {
      const dec = new Date(2025, 11, 15);
      expect(getNextMonthString(dec)).toBe('2026-01');
    });

    it('defaults to next month from today if no argument is given', () => {
      const expected = getNextMonthString(new Date());
      expect(getNextMonthString()).toBe(expected);
    });
  });
});
