import httpClient from '@/lib/httpClient';

type Portfolio = string;
type AssetClass = string;
type AssetName = string;
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

type Share = {
  currentShare: number;
  diffBRL: number;
  assetClass: AssetClass;
  asset?: AssetName;
  targetShare: number;
  value: number;
};

type ShareByPortfolio = {
  portfolio: Portfolio;
  shares: Share[];
};

export type PortfolioShares = {
  shares: ShareByPortfolio[];
  total: number;
};

const getShares = async () => {
  const url = `/api/portfolio/shares`;
  return await httpClient.get<PortfolioShares>(url);
};

type PortfolioHistoryItem = {
  date: string;
  portfolios: Record<string, number>;
};

export type PortfolioHistory = PortfolioHistoryItem[];

const getHistory = async () => {
  const url = `/api/portfolio/history`;
  return await httpClient.get<PortfolioHistory>(url);
};

export type TransferParams = {
  value: number | 'all';
  portfolio: Portfolio;
  origin: Asset;
  destiny: Asset;
};

const transfer = async (data: TransferParams) => {
  const url = '/api/portfolio/transfer';
  return await httpClient.post<{ status: string }>(url, data);
};

type SwapParams = {
  value: number | 'all';
  portfolio: Portfolio;
  origin: Asset;
  destiny: Asset;
  liquidity: Portfolio;
};

const swap = async (data: SwapParams) => {
  const url = '/api/portfolio/swap';
  return await httpClient.post<{ status: string }>(url, data);
};

export default {
  getBalance,
  getShares,
  getHistory,
  transfer,
  swap,
};
