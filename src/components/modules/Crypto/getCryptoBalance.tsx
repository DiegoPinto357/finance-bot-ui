import { useQuery, QueryClient } from 'react-query';
import cryptoService from '../../../services/crypto';

import type { CryptoPortfolioType } from '../../../services/crypto';

const queryClient = new QueryClient();

export const useGetCryptoBalance = (portfolioType: CryptoPortfolioType) =>
  useQuery(['cryptoBalance', portfolioType], () =>
    cryptoService.getBalance(portfolioType)
  );

export const getCryptoBalance = (portfolioType: CryptoPortfolioType) =>
  queryClient.fetchQuery(['cryptoBalance', portfolioType], () => cryptoService);
