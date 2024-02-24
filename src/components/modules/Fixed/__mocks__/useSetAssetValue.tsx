export const mockedSetAssetValue = vi.fn();

const useSetAssetValue = () => ({ setAssetValue: mockedSetAssetValue });

export default useSetAssetValue;
