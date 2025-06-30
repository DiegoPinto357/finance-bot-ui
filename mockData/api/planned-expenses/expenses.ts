import { PlannedExpense } from '../../../src/types';

export const plannedExpenses: PlannedExpense[] = [
  {
    id: '1',
    description: 'Netflix',
    portfolio: 'Essencial',
    amount: 39.9,
    installments: 1,
    currentInstallment: 1,
    date: '2025-07-10',
  },
  {
    id: '2',
    description: 'Academia',
    portfolio: 'Essencial',
    amount: 120.0,
    installments: 1,
    currentInstallment: 1,
    date: '2025-07-15',
  },
  {
    id: '3',
    description: 'Celular Novo',
    portfolio: 'Investimentos',
    amount: 500.0,
    installments: 12,
    currentInstallment: 3,
    date: '2025-07-20',
  },
];
