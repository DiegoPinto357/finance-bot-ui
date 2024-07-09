export const mockedSetFixedAssetValue = vi.fn();

export const useSetFixedAssetValue = () => ({
  setFixedAssetValue: mockedSetFixedAssetValue,
});
