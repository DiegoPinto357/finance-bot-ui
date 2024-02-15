import axios from 'axios';

const host = 'http://localhost:3001';
// const host = 'http://192.168.1.200:3001';

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
  setAssetValue,
};
