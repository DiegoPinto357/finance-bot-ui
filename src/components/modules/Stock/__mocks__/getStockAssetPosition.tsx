import type { StockAssetType } from '@/types';

const data: Record<StockAssetType, number> = {
  br: 0,
  us: 0,
  fii: 0,
  float: 100,
};

export const getStockAssetPosition = (assetType: StockAssetType) =>
  Promise.resolve(data[assetType]);
