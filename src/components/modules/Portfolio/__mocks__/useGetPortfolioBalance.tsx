import portfolioBalance from '../../../../../mockData/api/portfolio/balance';

import type { UseQueryResult } from 'react-query';
import type { PortfolioBalance } from '@/services/portfolio';

const useGetportfolioBalance = () =>
  ({
    data: portfolioBalance,
  } as unknown as UseQueryResult<PortfolioBalance, unknown>);

export default useGetportfolioBalance;
