import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockedSwap } from './__mocks__/useSwap';
import { mockedSetFixedAssetValue } from '../Fixed/__mocks__/setFixedAssetValue';
import { mockedSetStockAssetValue } from '../Stock/__mocks__/setStockAssetValue';
import { formatAssetName } from '@/lib/formatString';
import { fillFormField, selectFormFieldOption } from '@/testUtils/forms';
import SwapForm from './SwapForm';
import portfolios from '../../../../mockData/api/portfolio/portfolios';

vi.mock('../Fixed/setFixedAssetValue');
vi.mock('../Stock/setStockAssetValue');
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

  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  it('does not swap values if the form validation fails', async () => {
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

    const form = screen.getByRole('form', { name: 'swap' });
    fireEvent.submit(form);

    await waitFor(() => {
      const errorMessage = screen.getByText('Required field');
      expect(errorMessage).toBeInTheDocument();
      expect(mockedSetFixedAssetValue).not.toBeCalled();
      expect(mockedSwap).not.toBeCalled();
    });
  });

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

  it('renders current origin and destiny values on field descriptions', async () => {
    render(
      <SwapForm
        operationData={operationData}
        currentAssetValues={currentAssetValues}
        portfolios={portfolios}
        onSubmmit={() => {}}
        onError={() => {}}
      />
    );

    const originCurrentValueField = screen.getByRole('spinbutton', {
      name: `Origin (${formatAssetName(
        operationData.originAsset
      )}) Current Value`,
    });
    const destinyCurrentValueField = screen.getByRole('spinbutton', {
      name: `Destiny (${formatAssetName(
        operationData.destinyAsset
      )}) Current Value`,
    });

    expect(originCurrentValueField).toHaveAccessibleDescription(
      'Current value: R$ 1.950,00'
    );
    expect(destinyCurrentValueField).toHaveAccessibleDescription(
      'Current value: R$ 876,00'
    );
  });

  it('skips setting current asset values before swap when fields are empty', async () => {
    render(
      <SwapForm
        operationData={operationData}
        currentAssetValues={currentAssetValues}
        portfolios={portfolios}
        onSubmmit={() => {}}
        onError={() => {}}
      />
    );

    await fillFormField('Value', value);

    const form = screen.getByRole('form', { name: 'swap' });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockedSetFixedAssetValue).not.toBeCalled();
      expect(mockedSwap).toBeCalledTimes(1);
      expect(mockedSwap).toBeCalledWith({
        portfolio: 'suricat',
        origin: { class: 'fixed', name: 'iti' },
        destiny: { class: 'fixed', name: 'nubank' },
        value,
        liquidity: 'amortecedor',
      });
    });
  });

  it('swaps all available funds', async () => {
    render(
      <SwapForm
        operationData={operationData}
        currentAssetValues={currentAssetValues}
        portfolios={portfolios}
        onSubmmit={() => {}}
        onError={() => {}}
      />
    );

    const form = screen.getByRole('form', { name: 'swap' });

    const transferAllFundsCheckbox = screen.getByRole('checkbox', {
      name: 'Swap all funds',
    });
    await userEvent.click(transferAllFundsCheckbox);

    const valueField = screen.getByRole('spinbutton', {
      name: 'Value',
    });
    expect(valueField).toBeDisabled();

    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockedSwap).toBeCalledTimes(1);
      expect(mockedSwap).toBeCalledWith({
        portfolio: 'suricat',
        origin: { class: 'fixed', name: 'iti' },
        destiny: { class: 'fixed', name: 'nubank' },
        value: 'all',
        liquidity: 'amortecedor',
      });
    });
  });

  it('swaps from fixed to stock float', async () => {
    const operationData = {
      portfolio: 'reformaCasa',
      originAsset: { class: 'fixed', name: 'nubank' },
      destinyAsset: { class: 'stock', name: 'float' },
      liquidity: 'amortecedor',
    } as const;

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

    const form = screen.getByRole('form', { name: 'swap' });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockedSetFixedAssetValue).toBeCalledTimes(1);
      expect(mockedSetFixedAssetValue).toBeCalledWith({
        asset: operationData.originAsset.name,
        value: newOriginCurrentValue,
      });
      expect(mockedSetStockAssetValue).toBeCalledTimes(1);
      expect(mockedSetStockAssetValue).toBeCalledWith({
        asset: operationData.destinyAsset.name,
        value: newDestinyCurrentValue,
      });

      expect(mockedSwap).toBeCalledTimes(1);
      expect(mockedSwap).toBeCalledWith({
        portfolio: operationData.portfolio,
        origin: operationData.originAsset,
        destiny: operationData.destinyAsset,
        value,
        liquidity: operationData.liquidity,
      });
    });
  });

  it('swaps from fixed to crypto backed', async () => {
    const operationData = {
      portfolio: 'reformaCasa',
      originAsset: { class: 'fixed', name: 'nubank' },
      destinyAsset: { class: 'crypto', name: 'backed' },
      liquidity: 'amortecedor',
    } as const;

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
    await fillFormField('Value', value);

    const form = screen.getByRole('form', { name: 'swap' });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockedSetFixedAssetValue).toBeCalledTimes(1);
      expect(mockedSetFixedAssetValue).toBeCalledWith({
        asset: operationData.originAsset.name,
        value: newOriginCurrentValue,
      });

      expect(mockedSwap).toBeCalledTimes(1);
      expect(mockedSwap).toBeCalledWith({
        portfolio: operationData.portfolio,
        origin: operationData.originAsset,
        destiny: operationData.destinyAsset,
        value,
        liquidity: operationData.liquidity,
      });
    });
  });

  it('does not render origin input to set asset value for invalid stock assets', async () => {
    const operationData = {
      portfolio: 'reformaCasa',
      originAsset: { class: 'stock', name: 'br' },
      destinyAsset: { class: 'fixed', name: 'iti' },
      liquidity: 'amortecedor',
    } as const;

    render(
      <SwapForm
        operationData={operationData}
        currentAssetValues={currentAssetValues}
        portfolios={portfolios}
        onSubmmit={() => {}}
        onError={() => {}}
      />
    );

    const originAssetValueField = screen.queryByRole('spinbutton', {
      name: `Origin (${formatAssetName(
        operationData.originAsset
      )}) Current Value`,
    });
    const destinyAssetValueField = screen.getByRole('spinbutton', {
      name: `Destiny (${formatAssetName(
        operationData.destinyAsset
      )}) Current Value`,
    });

    expect(originAssetValueField).not.toBeInTheDocument();
    expect(destinyAssetValueField).toBeInTheDocument();

    await fillFormField('Value', value);

    const form = screen.getByRole('form', { name: 'swap' });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockedSwap).toBeCalledTimes(1);
      expect(mockedSwap).toBeCalledWith({
        portfolio: operationData.portfolio,
        origin: operationData.originAsset,
        destiny: operationData.destinyAsset,
        value,
        liquidity: operationData.liquidity,
      });
    });
  });

  it('does not render destiny input to set asset value for invalid stock assets', async () => {
    const operationData = {
      portfolio: 'reformaCasa',
      originAsset: { class: 'fixed', name: 'nubank' },
      destinyAsset: { class: 'stock', name: 'br' },
      liquidity: 'amortecedor',
    } as const;

    render(
      <SwapForm
        operationData={operationData}
        currentAssetValues={currentAssetValues}
        portfolios={portfolios}
        onSubmmit={() => {}}
        onError={() => {}}
      />
    );

    const originAssetValueField = screen.getByRole('spinbutton', {
      name: `Origin (${formatAssetName(
        operationData.originAsset
      )}) Current Value`,
    });
    const destinyAssetValueField = screen.queryByRole('spinbutton', {
      name: `Destiny (${formatAssetName(
        operationData.destinyAsset
      )}) Current Value`,
    });

    expect(originAssetValueField).toBeInTheDocument();
    expect(destinyAssetValueField).not.toBeInTheDocument();

    await fillFormField('Value', value);

    const form = screen.getByRole('form', { name: 'swap' });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockedSwap).toBeCalledTimes(1);
      expect(mockedSwap).toBeCalledWith({
        portfolio: operationData.portfolio,
        origin: operationData.originAsset,
        destiny: operationData.destinyAsset,
        value,
        liquidity: operationData.liquidity,
      });
    });
  });

  it('does not render origin input to set asset value for invalid crypto assets', async () => {
    const operationData = {
      portfolio: 'reformaCasa',
      originAsset: { class: 'crypto', name: 'backed' },
      destinyAsset: { class: 'fixed', name: 'nubank' },
      liquidity: 'amortecedor',
    } as const;

    render(
      <SwapForm
        operationData={operationData}
        currentAssetValues={currentAssetValues}
        portfolios={portfolios}
        onSubmmit={() => {}}
        onError={() => {}}
      />
    );

    const originAssetValueField = screen.queryByRole('spinbutton', {
      name: `Origin (${formatAssetName(
        operationData.originAsset
      )}) Current Value`,
    });
    const destinyAssetValueField = screen.getByRole('spinbutton', {
      name: `Destiny (${formatAssetName(
        operationData.destinyAsset
      )}) Current Value`,
    });

    expect(originAssetValueField).not.toBeInTheDocument();
    expect(destinyAssetValueField).toBeInTheDocument();

    await fillFormField('Value', value);

    const form = screen.getByRole('form', { name: 'swap' });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockedSwap).toBeCalledTimes(1);
      expect(mockedSwap).toBeCalledWith({
        portfolio: operationData.portfolio,
        origin: operationData.originAsset,
        destiny: operationData.destinyAsset,
        value,
        liquidity: operationData.liquidity,
      });
    });
  });

  it('does not render destiny input to set asset value for invalid crypto assets', async () => {
    const operationData = {
      portfolio: 'reformaCasa',
      originAsset: { class: 'fixed', name: 'nubank' },
      destinyAsset: { class: 'crypto', name: 'defi2' },
      liquidity: 'amortecedor',
    } as const;

    render(
      <SwapForm
        operationData={operationData}
        currentAssetValues={currentAssetValues}
        portfolios={portfolios}
        onSubmmit={() => {}}
        onError={() => {}}
      />
    );

    const originAssetValueField = screen.getByRole('spinbutton', {
      name: `Origin (${formatAssetName(
        operationData.originAsset
      )}) Current Value`,
    });
    const destinyAssetValueField = screen.queryByRole('spinbutton', {
      name: `Destiny (${formatAssetName(
        operationData.destinyAsset
      )}) Current Value`,
    });

    expect(originAssetValueField).toBeInTheDocument();
    expect(destinyAssetValueField).not.toBeInTheDocument();

    await fillFormField('Value', value);

    const form = screen.getByRole('form', { name: 'swap' });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockedSwap).toBeCalledTimes(1);
      expect(mockedSwap).toBeCalledWith({
        portfolio: operationData.portfolio,
        origin: operationData.originAsset,
        destiny: operationData.destinyAsset,
        value,
        liquidity: operationData.liquidity,
      });
    });
  });
});
