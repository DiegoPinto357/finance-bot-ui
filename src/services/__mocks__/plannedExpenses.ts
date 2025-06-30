import { vi } from 'vitest';
import { plannedExpenses } from '../../../mockData/api/planned-expenses/expenses';

export const getPlannedExpenses = vi.fn().mockResolvedValue(plannedExpenses);

export const addPlannedExpense = vi.fn().mockResolvedValue(plannedExpenses[0]);
