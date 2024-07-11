import type { Asset } from '@/types';

export const formatAssetName = (asset: Asset) =>
  `${asset.class} - ${asset.name}`;

export const capitalizeString = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);
