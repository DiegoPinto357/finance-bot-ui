import httpClient from '../lib/httpClient';
import { PortfolioInstallments } from '../types';

export const getMonthlyInstallments = async ({
  month,
  year,
}: {
  month: string;
  year: number;
}): Promise<PortfolioInstallments[]> => {
  return await httpClient.get(
    `/api/plannedExpenses/monthly?month=${month}&year=${year}`
  );
};

export type AddPlannedExpense = {
  description: string;
  portfolio: string;
  totalValue: number;
  installments: number;
  startMonth: string;
  startYear: number;
};

export const addPlannedExpense = async (
  data: AddPlannedExpense
): Promise<void> => {
  return await httpClient.post('/api/plannedExpenses', data);
};
