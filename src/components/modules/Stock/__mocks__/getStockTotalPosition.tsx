export const mockedSetStockAssetValue = vi.fn();

const useSetAssetValue = () => ({ setAssetValue: mockedSetStockAssetValue });

export default useSetAssetValue;
