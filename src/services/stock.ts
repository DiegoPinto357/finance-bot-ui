import httpClient from '@/lib/httpClient';

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
  setAssetValue,
};
