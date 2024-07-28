import { renderHook, waitFor } from '@testing-library/react';
import useGetAssetBalance from './useGetAssetBalance';

import type { Asset } from '@/types';

vi.mock('../Fixed/getFixedBalance');
vi.mock('../Stock/getStockAssetPosition');

describe('useGetAssetBalance', () => {
  it('gets fixed balances', async () => {
    const assets: Asset[] = [
      { class: 'fixed', name: 'iti' },
      { class: 'fixed', name: 'nubank' },
    ];

    const { result } = renderHook(() => useGetAssetBalance(assets));
    await waitFor(() => result.current);

    expect(result).toEqual({ current: [6943.7, 12340.05] });
  });

  it('gets fixed and stock balances', async () => {
    const assets: Asset[] = [
      { class: 'fixed', name: 'iti' },
      { class: 'stock', name: 'float' },
    ];

    const { result } = renderHook(() => useGetAssetBalance(assets));
    await waitFor(() => result.current);

    expect(result).toEqual({ current: [6943.7, 100] });
  });

  it.todo('handles a partial error while getting balances');
  it.todo('handles an error while getting balances');
});
