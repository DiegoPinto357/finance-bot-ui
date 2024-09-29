import { renderHook, waitFor } from '@testing-library/react';
import useSetAssetValue from './useSetAssetValue';
import { mockedSetFixedAssetValue } from '../Fixed/__mocks__/setFixedAssetValue';
import { mockedSetStockAssetValue } from '../Stock/__mocks__/setStockAssetValue';

import type { Asset } from '@/types';

vi.mock('../Fixed/setFixedAssetValue');
vi.mock('../Stock/setStockAssetValue');

describe('useSetAssetValue', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('sets fixed asset value', async () => {
    const asset: Asset = { class: 'fixed', name: 'iti' };
    const value = 10000;

    const { result } = renderHook(() => useSetAssetValue());
    await waitFor(() => result.current);
    const setAssetValue = result.current.setAssetValue;
    await setAssetValue({ asset, value });

    expect(mockedSetFixedAssetValue).toBeCalledTimes(1);
    expect(mockedSetFixedAssetValue).toBeCalledWith({
      asset: asset.name,
      value,
    });
    expect(mockedSetStockAssetValue).not.toBeCalled();
  });

  it('sets stock asset value', async () => {
    const asset: Asset = { class: 'stock', name: 'float' };
    const value = 300;

    const { result } = renderHook(() => useSetAssetValue());
    await waitFor(() => result.current);
    const setAssetValue = result.current.setAssetValue;
    await setAssetValue({ asset, value });

    expect(mockedSetFixedAssetValue).not.toBeCalled();
    expect(mockedSetStockAssetValue).toBeCalledTimes(1);
    expect(mockedSetStockAssetValue).toBeCalledWith({
      assetType: asset.name,
      value,
    });
  });
});
