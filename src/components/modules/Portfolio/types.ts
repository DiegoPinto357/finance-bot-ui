import type { Asset } from '@/types';

export type DragAndDropOperationData = {
  portfolio: string;
  originAsset: Asset;
  destinyAsset: Asset;
};

export type CurrentAssetValues = {
  originCurrentValue: number;
  destinyCurrentValue: number;
};
