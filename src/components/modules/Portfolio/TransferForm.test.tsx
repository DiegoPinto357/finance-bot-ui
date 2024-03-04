import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockedTransfer } from './__mocks__/useTransfer';
import { mockedSetAssetValue } from '../Fixed/__mocks__/useSetAssetValue';
import { fillFormField } from '@/testUtils/forms';
import TransferForm from './TransferForm';

vi.mock('../Fixed/useSetAssetValue');
vi.mock('./useTransfer');

describe('TransferForm', () => {
  const operationData = {
    portfolio: 'suricat',
    originAsset: 'iti',
    destinyAsset: 'nubank',
  };
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
      `Origin (${operationData.originAsset}) Current Value`,
      newOriginCurrentValue
    );
    await fillFormField(
      `Destiny (${operationData.destinyAsset}) Current Value`,
      newDestinyCurrentValue
    );
    await fillFormField('Value', value);

    const form = screen.getByRole('form', { name: 'transfer' });
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
      `Origin (${operationData.originAsset}) Current Value`,
      newOriginCurrentValue
    );
    await fillFormField(
      `Destiny (${operationData.destinyAsset}) Current Value`,
      newDestinyCurrentValue
    );

    const form = screen.getByRole('form', { name: 'transfer' });
    fireEvent.submit(form);

    await waitFor(() => {
      const errorMessage = screen.getByText('Required field');
      expect(errorMessage).toBeInTheDocument();
      expect(mockedSetAssetValue).not.toBeCalled();
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
      name: `Origin (${operationData.originAsset}) Current Value`,
    });
    const destinyCurrentValueField = screen.getByRole('spinbutton', {
      name: `Destiny (${operationData.destinyAsset}) Current Value`,
    });

    expect(originCurrentValueField).toHaveAccessibleDescription(
      'Current value: R$ 1.950,00'
    );
    expect(destinyCurrentValueField).toHaveAccessibleDescription(
      'Current value: R$ 876,00'
    );
  });

  it('skips setting current asset values before transfer', async () => {
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
      expect(mockedSetAssetValue).not.toBeCalled();
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
});
