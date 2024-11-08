import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockedTransfer } from '../__mocks__/useTransfer';
import { mockedSetFixedAssetValue } from '../../Fixed/__mocks__/setFixedAssetValue';
import { mockedSetStockAssetValue } from '../../Stock/__mocks__/setStockAssetValue';
import { formatAssetName } from '@/lib/formatString';
import { fillFormField } from '@/testUtils/forms';
import TransferForm from './TransferForm';

vi.mock('../../Fixed/setFixedAssetValue');
vi.mock('../../Stock/setStockAssetValue');
vi.mock('../useTransfer');

describe('TransferForm', () => {
  const operationData = {
    portfolio: 'suricat',
    originAsset: { class: 'fixed', name: 'iti' },
    destinyAsset: { class: 'fixed', name: 'nubank' },
  } as const;
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

  it('sets current asset values and executes transfer', async () => {
    render(
      <TransferForm
        operationData={operationData}
        currentAssetValues={currentAssetValues}
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

    const form = screen.getByRole('form', { name: 'transfer' });
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

      expect(mockedTransfer).toBeCalledTimes(1);
      expect(mockedTransfer).toBeCalledWith({
        portfolio: 'suricat',
        origin: { class: 'fixed', name: 'iti' },
        destiny: { class: 'fixed', name: 'nubank' },
        value,
      });
    });
  });

  it('does not transfer value if the form validation fails', async () => {
    render(
      <TransferForm
        operationData={operationData}
        currentAssetValues={currentAssetValues}
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

    const form = screen.getByRole('form', { name: 'transfer' });
    fireEvent.submit(form);

    await waitFor(() => {
      const errorMessage = screen.getByText('Required field');
      expect(errorMessage).toBeInTheDocument();
      expect(mockedSetFixedAssetValue).not.toBeCalled();
      expect(mockedTransfer).not.toBeCalled();
    });
  });

  it('renders current origin and destiny values on field descriptions', async () => {
    render(
      <TransferForm
        operationData={operationData}
        currentAssetValues={currentAssetValues}
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

  it('skips setting current asset values before transfer when fields are empty', async () => {
    render(
      <TransferForm
        operationData={operationData}
        currentAssetValues={currentAssetValues}
        onSubmmit={() => {}}
        onError={() => {}}
      />
    );

    await fillFormField('Value', value);

    const form = screen.getByRole('form', { name: 'transfer' });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockedSetFixedAssetValue).not.toBeCalled();
      expect(mockedTransfer).toBeCalledTimes(1);
      expect(mockedTransfer).toBeCalledWith({
        portfolio: 'suricat',
        origin: { class: 'fixed', name: 'iti' },
        destiny: { class: 'fixed', name: 'nubank' },
        value,
      });
    });
  });

  it('transfers all available funds', async () => {
    render(
      <TransferForm
        operationData={operationData}
        currentAssetValues={currentAssetValues}
        onSubmmit={() => {}}
        onError={() => {}}
      />
    );

    const form = screen.getByRole('form', { name: 'transfer' });

    const transferAllFundsCheckbox = screen.getByRole('checkbox', {
      name: 'Transfer all funds',
    });
    await userEvent.click(transferAllFundsCheckbox);

    const valueField = screen.getByRole('spinbutton', {
      name: 'Value',
    });
    expect(valueField).toBeDisabled();

    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockedTransfer).toBeCalledTimes(1);
      expect(mockedTransfer).toBeCalledWith({
        portfolio: 'suricat',
        origin: { class: 'fixed', name: 'iti' },
        destiny: { class: 'fixed', name: 'nubank' },
        value: 'all',
      });
    });
  });

  it('transfers from fixed to stock float', async () => {
    const operationData = {
      portfolio: 'reformaCasa',
      originAsset: { class: 'fixed', name: 'nubank' },
      destinyAsset: { class: 'stock', name: 'float' },
    } as const;

    render(
      <TransferForm
        operationData={operationData}
        currentAssetValues={currentAssetValues}
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

    const form = screen.getByRole('form', { name: 'transfer' });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockedSetFixedAssetValue).toBeCalledTimes(1);
      expect(mockedSetFixedAssetValue).toBeCalledWith({
        asset: operationData.originAsset.name,
        value: newOriginCurrentValue,
      });
      expect(mockedSetStockAssetValue).toBeCalledTimes(1);
      expect(mockedSetStockAssetValue).toBeCalledWith({
        assetType: operationData.destinyAsset.name,
        value: newDestinyCurrentValue,
      });

      expect(mockedTransfer).toBeCalledTimes(1);
      expect(mockedTransfer).toBeCalledWith({
        portfolio: operationData.portfolio,
        origin: operationData.originAsset,
        destiny: operationData.destinyAsset,
        value,
      });
    });
  });

  it('transfers from fixed to crypto backed', async () => {
    const operationData = {
      portfolio: 'reformaCasa',
      originAsset: { class: 'fixed', name: 'nubank' },
      destinyAsset: { class: 'crypto', name: 'backed' },
    } as const;

    render(
      <TransferForm
        operationData={operationData}
        currentAssetValues={currentAssetValues}
        onSubmmit={() => {}}
        onError={() => {}}
      />
    );

    await fillFormField(
      `Origin (${formatAssetName(operationData.originAsset)}) Current Value`,
      newOriginCurrentValue
    );
    await fillFormField('Value', value);

    const form = screen.getByRole('form', { name: 'transfer' });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockedSetFixedAssetValue).toBeCalledTimes(1);
      expect(mockedSetFixedAssetValue).toBeCalledWith({
        asset: operationData.originAsset.name,
        value: newOriginCurrentValue,
      });

      expect(mockedTransfer).toBeCalledTimes(1);
      expect(mockedTransfer).toBeCalledWith({
        portfolio: operationData.portfolio,
        origin: operationData.originAsset,
        destiny: operationData.destinyAsset,
        value,
      });
    });
  });

  it('does not render origin input to set asset value for invalid stock assets', async () => {
    const operationData = {
      portfolio: 'reformaCasa',
      originAsset: { class: 'stock', name: 'br' },
      destinyAsset: { class: 'fixed', name: 'iti' },
    } as const;

    render(
      <TransferForm
        operationData={operationData}
        currentAssetValues={currentAssetValues}
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

    const form = screen.getByRole('form', { name: 'transfer' });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockedTransfer).toBeCalledTimes(1);
      expect(mockedTransfer).toBeCalledWith({
        portfolio: operationData.portfolio,
        origin: operationData.originAsset,
        destiny: operationData.destinyAsset,
        value,
      });
    });
  });

  it('does not render destiny input to set asset value for invalid stock assets', async () => {
    const operationData = {
      portfolio: 'reformaCasa',
      originAsset: { class: 'fixed', name: 'nubank' },
      destinyAsset: { class: 'stock', name: 'br' },
    } as const;

    render(
      <TransferForm
        operationData={operationData}
        currentAssetValues={currentAssetValues}
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

    const form = screen.getByRole('form', { name: 'transfer' });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockedTransfer).toBeCalledTimes(1);
      expect(mockedTransfer).toBeCalledWith({
        portfolio: operationData.portfolio,
        origin: operationData.originAsset,
        destiny: operationData.destinyAsset,
        value,
      });
    });
  });

  it('does not render origin input to set asset value for invalid crypto assets', async () => {
    const operationData = {
      portfolio: 'reformaCasa',
      originAsset: { class: 'crypto', name: 'backed' },
      destinyAsset: { class: 'fixed', name: 'nubank' },
    } as const;

    render(
      <TransferForm
        operationData={operationData}
        currentAssetValues={currentAssetValues}
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

    const form = screen.getByRole('form', { name: 'transfer' });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockedTransfer).toBeCalledTimes(1);
      expect(mockedTransfer).toBeCalledWith({
        portfolio: operationData.portfolio,
        origin: operationData.originAsset,
        destiny: operationData.destinyAsset,
        value,
      });
    });
  });

  it('does not render destiny input to set asset value for invalid crypto assets', async () => {
    const operationData = {
      portfolio: 'reformaCasa',
      originAsset: { class: 'fixed', name: 'nubank' },
      destinyAsset: { class: 'crypto', name: 'defi2' },
    } as const;

    render(
      <TransferForm
        operationData={operationData}
        currentAssetValues={currentAssetValues}
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

    const form = screen.getByRole('form', { name: 'transfer' });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockedTransfer).toBeCalledTimes(1);
      expect(mockedTransfer).toBeCalledWith({
        portfolio: operationData.portfolio,
        origin: operationData.originAsset,
        destiny: operationData.destinyAsset,
        value,
      });
    });
  });
});
