import axios from 'axios';

const host = 'http://localhost:3001';
// const host = 'http://192.168.1.200:3001';

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
  const url = `${host}/api/portfolio/balance`;
  const response = await axios.get<PortfolioBalance>(url);
  return response.data;
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
  const url = `${host}/api/portfolio/transfer`;
  const response = await axios.post<{ status: string }>(url, data);
  return response.data;
};

export default {
  getBalance,
  transfer,
};
