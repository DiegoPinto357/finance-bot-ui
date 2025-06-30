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

export type AddPlannedExpense = {
  description: string;
  portfolio: string;
  totalAmount: number;
  installments: number;
  startDate: string;
};

