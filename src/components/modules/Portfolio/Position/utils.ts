import type { Asset } from '@/types';

const manualFetchBalance = [
  { class: 'fixed' },
  { class: 'stock', name: 'float' },
];

export const needManualUpdate = (asset: Asset) =>
  manualFetchBalance.some(
    manualUpdatedAsset =>
      manualUpdatedAsset.class === asset.class &&
      (manualUpdatedAsset.name === undefined ||
        manualUpdatedAsset.name === asset.name)
  );
