import httpClient from '@/lib/httpClient';

type CryptoPortfolioType = 'hodl' | 'defi';

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

const getBalance = async (portfolioType: CryptoPortfolioType) => {
  const url = `/api/crypto/balance/${portfolioType}`;
  return await httpClient.get<HodlBalance>(url);
};

export default {
  getBalance,
};
