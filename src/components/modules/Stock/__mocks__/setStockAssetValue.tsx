export const mockedSetStockAssetValue = vi.fn();

export const useSetStockAssetValue = () => ({
  setStockAssetValue: mockedSetStockAssetValue,
});
