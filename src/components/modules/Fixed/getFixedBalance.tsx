import { useQuery, QueryClient } from 'react-query';
import fixedService from '../../../services/fixed';

const options = {
  staleTime: 0,
  cacheTime: 0,
};

const queryClient = new QueryClient();

export const useGetFixedBalance = (assetName?: string | string[]) =>
  useQuery(
    ['fixedBalance', assetName],
    () => fixedService.getBalance(assetName),
    options
  );

export const getFixedBalance = (assetName?: string | string[]) =>
  queryClient.fetchQuery(
    ['fixedBalance', assetName],
    () => fixedService.getBalance(assetName),
    options
  );
