export const formatPrecision = (value: number) => value.toPrecision(5);

export const formatCurrency = (
  value: number | undefined,
  allowZero: boolean = false
) => {
  if (value === undefined || (!allowZero && value === 0)) return '';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatPercentage = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
