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
  return new Date(dateString + '-01');
};
