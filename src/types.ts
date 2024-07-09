export type AssetClass = 'fixed' | 'stock' | 'crypto';

export type Asset = {
  class: AssetClass;
  name: string;
};

export type StockAssetType = 'float' | 'br' | 'us' | 'fii';
