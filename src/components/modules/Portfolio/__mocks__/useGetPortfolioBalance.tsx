import portfolioBalance from '../../../../../mockData/api/portfolio/balance';

import type { UseQueryResult } from 'react-query';
import type { PortfolioBalance } from '@/services/portfolio';

const refetch = vi.fn();

const useGetportfolioBalance = () =>
  ({
    data: portfolioBalance,
    refetch,
  } as unknown as UseQueryResult<PortfolioBalance, unknown>);

export default useGetportfolioBalance;
