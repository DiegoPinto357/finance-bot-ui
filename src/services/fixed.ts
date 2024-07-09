import httpClient from '@/lib/httpClient';

type FixedAssetBalance = {
  asset: string;
  value: number;
  liquidity?: boolean;
};

export type FixedBalance = {
  balance: FixedAssetBalance[];
  total: number;
};

const getBalance = async (assetName?: string | string[]) => {
  const url = `/api/fixed/balance`;
  return await httpClient.get<FixedBalance>(url, {
    params: { assetName },
  });
};

export type SetAssetValueParams = {
  asset: string;
  value: number;
};

const setAssetValue = async (data: SetAssetValueParams) => {
  const url = `/api/fixed/asset-value`;
  await httpClient.post(url, data);
  // TODO return data?
};

export default {
  getBalance,
  setAssetValue,
};
