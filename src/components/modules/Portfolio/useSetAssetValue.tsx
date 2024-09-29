import { useSetFixedAssetValue } from '../Fixed/setFixedAssetValue';
import { useSetStockAssetValue } from '../Stock/setStockAssetValue';

import type { Asset } from '@/types';

type Props = {
  asset: Asset;
  value: number;
};

const useSetAssetValue = () => {
  const { setFixedAssetValue } = useSetFixedAssetValue();
  const { setStockAssetValue } = useSetStockAssetValue();

  const setAssetValue = async ({ asset, value }: Props) => {
    if (asset.class === 'fixed') {
      return await setFixedAssetValue({ asset: asset.name, value });
    }

    if (asset.class === 'stock') {
      return await setStockAssetValue({ assetType: asset.name, value });
    }
  };

  return {
    setAssetValue,
  };
};

export default useSetAssetValue;
