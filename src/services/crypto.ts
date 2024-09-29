import httpClient from '@/lib/httpClient';

export type CryptoPortfolioType = 'hodl' | 'defi';

export type CryptoHodlBalanceItem = {
  asset: string;
  spot: number;
  earn: number;
  total: number;
  portfolioScore: number;
  priceBRL: number;
  positionBRL: number;
  positionTarget: number;
  position: number;
  positionDiff: number;
  diffBRL: number;
  diffTokens: number;
};

type HodlBalance = {
  balance: CryptoHodlBalanceItem[];
  total: number;
};

const getBalance = async (portfolioType: CryptoPortfolioType) => {
  const url = `/api/crypto/balance/${portfolioType}`;
  return await httpClient.get<HodlBalance>(url);
};

export default {
  getBalance,
};
