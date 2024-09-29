import { useQuery, QueryClient } from 'react-query';
import stockService from '../../../services/stock';

import type { StockAssetType } from '@/types';

const queryClient = new QueryClient();

export const useGetStockBalance = (assetType: StockAssetType) =>
  useQuery(['stockBalance', assetType], () =>
    stockService.getBalance(assetType)
  );

export const getStockBalance = (assetType: StockAssetType) =>
  queryClient.fetchQuery(['stockBalance', assetType], () =>
    stockService.getBalance(assetType)
  );
