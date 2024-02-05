import axios from 'axios';

const host = 'http://localhost:3001';
// const host = 'http://192.168.1.200:3001';

type AssetBalance = {
  asset: string;
  value: number;
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

export default {
  getBalance,
};
