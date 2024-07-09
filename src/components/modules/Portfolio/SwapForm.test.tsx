import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { mockedSwap } from './__mocks__/useSwap';
import { mockedSetFixedAssetValue } from '../Fixed/__mocks__/setFixedAssetValue';
import { formatAssetName } from '@/lib/formatString';
import { fillFormField, selectFormFieldOption } from '@/testUtils/forms';
import SwapForm from './SwapForm';
import portfolios from '../../../../mockData/api/portfolio/portfolios';

vi.mock('../Fixed/setFixedAssetValue');
vi.mock('./useSwap');

describe('SwapForm', () => {
  const operationData = {
    portfolio: 'suricat',
    originAsset: { class: 'fixed', name: 'iti' },
    destinyAsset: { class: 'fixed', name: 'nubank' },
  } as const;
  const liquidityProvider = 'reservaEmergencia';
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
        portfolios={portfolios}
        onSubmmit={() => {}}
        onError={() => {}}
      />
    );

    await fillFormField(
      `Origin (${formatAssetName(operationData.originAsset)}) Current Value`,
      newOriginCurrentValue
    );
    await fillFormField(
      `Destiny (${formatAssetName(operationData.destinyAsset)}) Current Value`,
      newDestinyCurrentValue
    );
    await fillFormField('Value', value);
    await selectFormFieldOption('Liquidity Provider', liquidityProvider);

    const form = screen.getByRole('form', { name: 'swap' });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockedSetFixedAssetValue).toBeCalledTimes(2);
      expect(mockedSetFixedAssetValue).toBeCalledWith({
        asset: 'iti',
        value: newOriginCurrentValue,
      });
      expect(mockedSetFixedAssetValue).toBeCalledWith({
        asset: 'nubank',
        value: newDestinyCurrentValue,
      });

      expect(mockedSwap).toBeCalledTimes(1);
      expect(mockedSwap).toBeCalledWith({
        portfolio: 'suricat',
        origin: { class: 'fixed', name: 'iti' },
        destiny: { class: 'fixed', name: 'nubank' },
        value,
        liquidity: liquidityProvider,
      });
    });
  });

  // TODO remove portfolio from the liquidity provider options
  it('raises an error if portfolio and liquidity provider are the same', async () => {
    const onErrorMock = vi.fn();

    render(
      <SwapForm
        operationData={{ ...operationData, portfolio: liquidityProvider }}
        currentAssetValues={currentAssetValues}
        portfolios={portfolios}
        onSubmmit={() => {}}
        onError={onErrorMock}
      />
    );

    await fillFormField(
      `Origin (${formatAssetName(operationData.originAsset)}) Current Value`,
      newOriginCurrentValue
    );
    await fillFormField(
      `Destiny (${formatAssetName(operationData.destinyAsset)}) Current Value`,
      newDestinyCurrentValue
    );
    await fillFormField('Value', value);
    await selectFormFieldOption('Liquidity Provider', liquidityProvider);

    const form = screen.getByRole('form', { name: 'swap' });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(onErrorMock).toBeCalledTimes(1);
      expect(onErrorMock).toBeCalledWith(
        'Portfolio and liquidity provider must not be the same.'
      );
    });
  });
});
