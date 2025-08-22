export const formatMonthYear = (
  dateString: string,
  locale: string = 'default'
) => {
  if (!dateString) return '';
  const [year, month] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  return date.toLocaleString(locale, { month: 'short', year: 'numeric' });
};

export const monthYearStringToDate = (dateString: string): Date | undefined => {
  if (!dateString) return undefined;
  const [year, month] = dateString.split('-').map(Number);
  if (!year || !month) return undefined;
  return new Date(year, month - 1, 1);
};

export const getNextMonthString = (date: Date = new Date()): string => {
  const nextMonthDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  return `${nextMonthDate.getFullYear()}-${String(
    nextMonthDate.getMonth() + 1
  ).padStart(2, '0')}`;
};
