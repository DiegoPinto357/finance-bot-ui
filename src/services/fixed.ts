import axios from 'axios';

const host = 'http://localhost:3001';
// const host = 'http://192.168.1.200:3001';

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
  const url = `${host}/api/fixed/balance`;
  const response = await axios.get<FixedBalance>(url, {
    params: { assetName },
  });
  return response.data;
};

type SetAssetValueParams = {
  asset: string;
  value: number;
};

const setAssetValue = async (data: SetAssetValueParams) => {
  const url = `${host}/api/fixed/asset-value`;
  await axios.post(url, data);
  // TODO return data?
};

export default {
  getBalance,
  setAssetValue,
};
