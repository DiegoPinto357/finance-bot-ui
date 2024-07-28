import type { UseQueryResult } from 'react-query';
import type { FixedBalance } from '@/services/fixed';

const data = {
  balance: [
    {
      asset: 'nubank',
      liquidity: true,
      value: 12340.05,
    },
    {
      asset: 'iti',
      liquidity: true,
      value: 6943.7,
    },
    {
      asset: 'inco',
      value: 10891.02,
    },
  ],
};

const getDataByAsset = (assetName: string): FixedBalance => {
  const balance = data.balance.filter(({ asset }) => asset === assetName);
  const total = balance.length ? balance[0].value : 0;
  return { balance, total };
};

export const useGetFixedBalance = (assetName: string) =>
  ({ data: getDataByAsset(assetName) } as unknown as UseQueryResult<
    FixedBalance,
    unknown
  >);

export const getFixedBalance = (assetName: string) =>
  Promise.resolve(getDataByAsset(assetName));
