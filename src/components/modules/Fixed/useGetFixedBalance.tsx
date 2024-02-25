import { useQuery } from 'react-query';
import fixedService from '../../../services/fixed';

const useGetFixedBalance = (assetName?: string | string[]) =>
  useQuery('fixedBalance', () => fixedService.getBalance(assetName), {
    staleTime: 0,
    cacheTime: 0,
  });

export default useGetFixedBalance;
