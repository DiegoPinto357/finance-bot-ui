export const formatPrecision = (value: number) => value.toPrecision(5);

type FormatCurrencyOptions = {
  allowZero?: boolean;
  omitCents?: boolean;
};

export const formatCurrency = (
  value: number | undefined,
  options: FormatCurrencyOptions = {}
) => {
  const { allowZero, omitCents } = options;

  if (value === undefined || (!allowZero && value === 0)) return '';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: omitCents ? 0 : 2,
    maximumFractionDigits: omitCents ? 0 : 2,
  }).format(value);
};

export const formatPercentage = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
