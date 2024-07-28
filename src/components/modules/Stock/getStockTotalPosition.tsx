import { useQuery, QueryClient } from 'react-query';
import stockService from '../../../services/stock';

const options = {
  staleTime: 0,
  cacheTime: 0,
};

const queryClient = new QueryClient();

export const useGetStockTotalPosition = () =>
  useQuery(
    ['stockTotalPosition'],
    () => stockService.getTotalPosition(),
    options
  );

export const getStockTotalPosition = () =>
  queryClient.fetchQuery(
    ['stockTotalPosition'],
    () => stockService.getTotalPosition(),
    options
  );
