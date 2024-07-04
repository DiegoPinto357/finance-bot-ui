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
  ],
  total: 19283.75,
};

export const useGetFixedBalance = () =>
  ({ data } as unknown as UseQueryResult<FixedBalance, unknown>);

export const getFixedBalance = () => Promise.resolve(data);
