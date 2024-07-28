import httpClient from '@/lib/httpClient';

import type { StockAssetType } from '@/types';

const getAssetPosition = async (assetType: StockAssetType) => {
  const url = `/api/stock/asset-position`;
  return await httpClient.get<number>(url, { params: { assetType } });
};

type StockTotalPosition = Record<StockAssetType, number> & { total: number };

const getTotalPosition = async () => {
  const url = `/api/stock/total-position`;
  return await httpClient.get<StockTotalPosition>(url);
};

type SetAssetValueParams = {
  asset: string;
  value: number;
};

const setAssetValue = async (data: SetAssetValueParams) => {
  const url = `/api/stock/asset-value`;
  await httpClient.post(url, data);
  // TODO return data?
};

export default {
  getAssetPosition,
  getTotalPosition,
  setAssetValue,
};
