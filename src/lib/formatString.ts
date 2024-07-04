import type { Asset } from '@/types';

export const formatAssetName = (asset: Asset) =>
  `${asset.class} - ${asset.name}`;
