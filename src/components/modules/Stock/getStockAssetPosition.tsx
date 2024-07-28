import { useQuery, QueryClient } from 'react-query';
import stockService from '../../../services/stock';

import type { StockAssetType } from '@/types';

const options = {
  staleTime: 0,
  cacheTime: 0,
};

const queryClient = new QueryClient();

export const useGetStockAssetPosition = (assetType: StockAssetType) =>
  useQuery(
    ['stockTotalPosition', assetType],
    () => stockService.getAssetPosition(assetType),
    options
  );

export const getStockAssetPosition = (assetType: StockAssetType) =>
  queryClient.fetchQuery(
    ['stockTotalPosition', assetType],
    () => stockService.getAssetPosition(assetType),
    options
  );
