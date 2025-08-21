import { useQuery } from 'react-query';
import { getMonthlyInstallments } from '../../../services/plannedExpenses';
import { MONTHS } from '../../../lib/constants';

export const useGetMonthlyInstallments = ({
  month,
  year,
}: {
  month: number;
  year: number;
}) => {
  const monthAbbreviation = MONTHS[month - 1];
  return useQuery(['monthly-installments', monthAbbreviation, year], () =>
    getMonthlyInstallments({ month: monthAbbreviation, year })
  );
};

