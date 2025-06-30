import httpClient from '../lib/httpClient';
import { AddPlannedExpense, PlannedExpense } from '../types';

export const getPlannedExpenses = async ({
  month,
  year,
}: {
  month: number;
  year: number;
}): Promise<PlannedExpense[]> => {
  return await httpClient.get(`/planned-expenses?month=${month}&year=${year}`);
};

export const addPlannedExpense = async (
  data: AddPlannedExpense
): Promise<PlannedExpense> => {
  return await httpClient.post('/planned-expenses', data);
};
