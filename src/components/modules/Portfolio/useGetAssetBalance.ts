import { useEffect, useRef, useState } from 'react';
import { getFixedBalance } from '../Fixed/getFixedBalance';

import type { Asset } from '@/types';
import { FixedBalance } from '@/services/fixed';

function arrayEqual(a1: Asset[], a2: Asset[]) {
  if (a1.length !== a2.length) return false;
  for (let i = 0; i < a1.length; i++) {
    if (a1[i] !== a2[i]) {
      return false;
    }
  }
  return true;
}

const useGetAssetBalance = (assets: Asset[]) => {
  const [balance, setBalance] = useState<FixedBalance>();
  const assetsRef = useRef(assets);

  if (!arrayEqual(assets, assetsRef.current)) {
    assetsRef.current = assets;
  }

  useEffect(() => {
    const fetchAssetBalance = async (assets: Asset[]) => {
      const fixedAssets = assets
        .filter(asset => asset.class === 'fixed')
        .map(({ name }) => name);
      setBalance(await getFixedBalance(fixedAssets));
    };
    fetchAssetBalance(assetsRef.current);
  }, []);

  return balance;
};

export default useGetAssetBalance;
