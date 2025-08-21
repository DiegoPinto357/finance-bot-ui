export type AssetClass = 'fixed' | 'stock' | 'crypto';

export type Asset = {
  class: AssetClass;
  name: string;
};

export type StockAssetType = 'float' | 'br' | 'us' | 'fii';

export type PlannedExpense = {
  id: string;
  description: string;
  portfolio: string;
  amount: number;
  installments: number;
  currentInstallment: number;
  date: string;
};

export type InstallmentDetail = {
  installmentNumber: number;
  value: number;
  totalInstallments: number;
  description: string;
  plannedExpenseId: string;
};

export type PortfolioInstallments = {
  portfolio: string;
  installments: InstallmentDetail[];
  totalValue: number;
};

