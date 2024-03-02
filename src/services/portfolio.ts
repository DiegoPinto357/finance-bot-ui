import httpClient from '@/lib/httpClient';

export type AssetBalance = {
  asset: string;
  value: number;
  liquidity?: boolean;
};

type BalanceByAssetType = {
  balance: {
    fixed?: {
      balance: AssetBalance[];
      total: number;
    };
    stock?: {
      balance: AssetBalance[];
      total: number;
    };
    crypto?: {
      balance: AssetBalance[];
      total: number;
    };
  };
  total: number;
};

export type PortfolioBalance = {
  balance: Record<string, BalanceByAssetType>;
  total: number;
};

const getBalance = async () => {
  const url = `/api/portfolio/balance`;
  return await httpClient.get<PortfolioBalance>(url);
};

type Portfolio = string;
type FixedAsset = string;
type StockAsset = string;
type CryptoAsset = string;
type Asset =
  | {
      class: 'fixed';
      name: FixedAsset;
    }
  | {
      class: 'stock';
      name: StockAsset;
    }
  | {
      class: 'crypto';
      name: CryptoAsset;
    };

export type TransferParams = {
  value: number | 'all';
  portfolio: Portfolio;
  origin: Asset;
  destiny: Asset;
};

const transfer = async (data: TransferParams) => {
  const url = `/api/portfolio/transfer`;
  return await httpClient.post<{ status: string }>(url, data);
};

export default {
  getBalance,
  transfer,
};
