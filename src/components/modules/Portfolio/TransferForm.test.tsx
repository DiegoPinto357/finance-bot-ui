import {
  render,
  screen,
  within,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockedTransfer } from './__mocks__/useTransfer';
import { mockedSetAssetValue } from '../Fixed/__mocks__/useSetAssetValue';
import TransferForm from './TransferForm';

vi.mock('../Fixed/useGetFixedBalance');
vi.mock('../Fixed/useSetAssetValue');
vi.mock('./useTransfer');

const fillFormField = async (fieldName: string, value: string | number) => {
  let fieldRole;
  let fieldValue;

  if (typeof value === 'number') {
    fieldRole = 'spinbutton';
    fieldValue = value.toString();
  } else {
    fieldRole = 'textbox';
    fieldValue = value;
  }

  const form = screen.getByRole('form', { name: 'transfer' });
  const field = within(form).getByRole(fieldRole, {
    name: fieldName,
  });
  await userEvent.type(field, fieldValue);
};

describe('TransferForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sets current assetvalues and executes transfer', async () => {
    const operationData = {
      portfolio: 'suricat',
      originAsset: 'iti',
      destinyAsset: 'nubank',
    };
    const originCurrentValue = 2000;
    const destinyCurrentValue = 1000;
    const value = 100;

    render(
      <TransferForm
        operationData={operationData}
        onSubmmit={() => {}}
        onError={() => {}}
      />
    );

    await fillFormField(
      `Origin (${operationData.originAsset}) Current Value`,
      originCurrentValue
    );
    await fillFormField(
      `Destiny (${operationData.destinyAsset}) Current Value`,
      destinyCurrentValue
    );
    await fillFormField('Value', value);

    const form = screen.getByRole('form', { name: 'transfer' });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockedSetAssetValue).toBeCalledTimes(2);
      expect(mockedSetAssetValue).toBeCalledWith({
        asset: 'iti',
        value: originCurrentValue,
      });
      expect(mockedSetAssetValue).toBeCalledWith({
        asset: 'nubank',
        value: destinyCurrentValue,
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
    const operationData = {
      portfolio: 'suricat',
      originAsset: 'iti',
      destinyAsset: 'nubank',
    };
    const originCurrentValue = 2000;
    const destinyCurrentValue = 1000;

    render(
      <TransferForm
        operationData={operationData}
        onSubmmit={() => {}}
        onError={() => {}}
      />
    );

    await fillFormField(
      `Origin (${operationData.originAsset}) Current Value`,
      originCurrentValue
    );
    await fillFormField(
      `Destiny (${operationData.destinyAsset}) Current Value`,
      destinyCurrentValue
    );

    const form = screen.getByRole('form', { name: 'transfer' });
    fireEvent.submit(form);

    await waitFor(() => {
      const errorMessage = screen.getByText('Number must be greater than 0');
      expect(errorMessage).toBeInTheDocument();
      expect(mockedSetAssetValue).not.toBeCalled();
      expect(mockedTransfer).not.toBeCalled();
    });
  });

  it('renders current origin and destiny values on field descriptions', async () => {
    const operationData = {
      portfolio: 'suricat',
      originAsset: 'iti',
      destinyAsset: 'nubank',
    };

    render(
      <TransferForm
        operationData={operationData}
        onSubmmit={() => {}}
        onError={() => {}}
      />
    );

    const form = screen.getByRole('form', { name: 'transfer' });
    const originCurrentValueField = within(form).getByRole('spinbutton', {
      name: `Origin (${operationData.originAsset}) Current Value`,
    });
    const destinyCurrentValueField = within(form).getByRole('spinbutton', {
      name: `Destiny (${operationData.destinyAsset}) Current Value`,
    });

    expect(originCurrentValueField).toHaveAccessibleDescription(
      'Current value: R$ 6.943,70'
    );
    expect(destinyCurrentValueField).toHaveAccessibleDescription(
      'Current value: R$ 12.340,05'
    );
  });

  it.todo('skips setting current asset values before transfer');

  it.todo('transfers all available funds');
});
