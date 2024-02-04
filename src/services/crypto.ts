import axios from 'axios';

const host = 'http://localhost:3001';
// const host = 'http://192.168.1.200:3001';

type PortfolioType = 'hodl' | 'defi';

type HodlBalance = {
  balance: {
    positionTarget: number;
    position: number;
    positionDiff: number;
    diffBRL: number;
    diffTokens: number;
    priceBRL: number;
    positionBRL: number;
    asset: string;
    spot: number;
    earn: number;
    total: number;
    portfolioScore: number;
  }[];
  total: number;
};

const getBalance = async (portfolioType: PortfolioType) => {
  const url = `${host}/api/crypto/balance/${portfolioType}`;
  const response = await axios.get<HodlBalance>(url);
  return response.data;
};

export default {
  getBalance,
};
