import type { UseQueryResult } from 'react-query';
import type { FixedBalance } from '@/services/fixed';

const useGetFixedBalance = () =>
  ({
    data: {
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
    },
  } as unknown as UseQueryResult<FixedBalance, unknown>);

export default useGetFixedBalance;
