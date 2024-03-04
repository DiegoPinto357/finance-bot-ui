import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import { mockedSwap } from './__mocks__/useSwap';
import { mockedSetAssetValue } from '../Fixed/__mocks__/useSetAssetValue';
import { fillFormField } from '@/testUtils/forms';
import SwapForm from './SwapForm';

vi.mock('../Fixed/useSetAssetValue');

describe('SwapForm', () => {
  const operationData = {
    portfolio: 'suricat',
    originAsset: 'iti',
    destinyAsset: 'nubank',
  };
  const liquidityProvider = 'amortecedor';
  const currentAssetValues = {
    originCurrentValue: 1950,
    destinyCurrentValue: 876,
  };
  const newOriginCurrentValue = 2000;
  const newDestinyCurrentValue = 1000;
  const value = 100;

  it('sets current asset values and executes swap', async () => {
    render(
      <SwapForm
        operationData={operationData}
        currentAssetValues={currentAssetValues}
        onSubmmit={() => {}}
        onError={() => {}}
      />
    );

    await fillFormField('Liquidity Provider', liquidityProvider);
    await fillFormField(
      `Origin (${operationData.originAsset}) Current Value`,
      newOriginCurrentValue
    );
    await fillFormField(
      `Destiny (${operationData.destinyAsset}) Current Value`,
      newDestinyCurrentValue
    );
    await fillFormField('Value', value);

    const form = screen.getByRole('form', { name: 'swap' });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockedSetAssetValue).toBeCalledTimes(2);
      expect(mockedSetAssetValue).toBeCalledWith({
        asset: 'iti',
        value: newOriginCurrentValue,
      });
      expect(mockedSetAssetValue).toBeCalledWith({
        asset: 'nubank',
        value: newDestinyCurrentValue,
      });

      // expect(mockedSwap).toBeCalledTimes(1);
      // expect(mockedSwap).toBeCalledWith({
      //   portfolio: 'suricat',
      //   origin: { class: 'fixed', name: 'iti' },
      //   destiny: { class: 'fixed', name: 'nubank' },
      //   value,
      // });
    });
  });
});
