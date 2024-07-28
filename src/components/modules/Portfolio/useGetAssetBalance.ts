import { useEffect, useRef, useState } from 'react';
import { getFixedBalance } from '../Fixed/getFixedBalance';
import { getStockAssetPosition } from '../Stock/getStockAssetPosition';

import type { Asset, StockAssetType } from '@/types';

// TODO move to libs
const arrayEqual = (a1: Asset[], a2: Asset[]) => {
  if (a1.length !== a2.length) return false;
  for (let i = 0; i < a1.length; i++) {
    if (a1[i] !== a2[i]) {
      return false;
    }
  }
  return true;
};

const useGetAssetBalance = (assets: Asset[]) => {
  const [balance, setBalance] = useState<(number | undefined)[]>([]);
  const assetsRef = useRef(assets);

  if (!arrayEqual(assets, assetsRef.current)) {
    assetsRef.current = assets;
  }

  useEffect(() => {
    const fetchAssetsBalances = async (assets: Asset[]) => {
      const balances = await Promise.all(
        assets.map(async asset => {
          if (asset.class === 'fixed') {
            return getFixedBalance(asset.name);
          }
          if (asset.class === 'stock') {
            return getStockAssetPosition(asset.name as StockAssetType);
          }
        })
      );

      setBalance(
        balances.map(balance =>
          typeof balance === 'number' ? balance : balance?.total
        )
      );
    };

    fetchAssetsBalances(assetsRef.current);
  }, []);

  return balance;
};

export default useGetAssetBalance;
