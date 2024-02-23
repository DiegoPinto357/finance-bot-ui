import {
  render,
  screen,
  within,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useTransfer from './useTransfer';
import useSetAssetValue from '../Fixed/useSetAssetValue';
import TransferForm from './TransferForm';

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
  const transfer = vi.fn();
  /* @ts-ignore */
  vi.mocked(useTransfer).mockReturnValue({
    transfer,
  });

  const setAssetValue = vi.fn();
  /* @ts-ignore */
  vi.mocked(useSetAssetValue).mockReturnValue({ setAssetValue });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sets current assetvalues and executes transfer', async () => {
    const data = { portfolio: 'suricat', origin: 'iti', destiny: 'nubank' };
    const originCurrentValue = 2000;
    const destinyCurrentValue = 1000;
    const value = 100;

    render(
      <TransferForm data={data} onSubmmit={() => {}} onError={() => {}} />
    );

    await fillFormField('Origin Current Value', originCurrentValue);
    await fillFormField('Destiny Current Value', destinyCurrentValue);
    await fillFormField('Value', value);

    const form = screen.getByRole('form', { name: 'transfer' });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(setAssetValue).toBeCalledTimes(2);
      expect(setAssetValue).toBeCalledWith({
        asset: 'iti',
        value: originCurrentValue,
      });
      expect(setAssetValue).toBeCalledWith({
        asset: 'nubank',
        value: destinyCurrentValue,
      });

      expect(transfer).toBeCalledTimes(1);
      expect(transfer).toBeCalledWith({
        portfolio: 'suricat',
        origin: { class: 'fixed', name: 'iti' },
        destiny: { class: 'fixed', name: 'nubank' },
        value,
      });
    });
  });

  it('does not transfer value if the form validation fails', async () => {
    const data = { portfolio: 'suricat', origin: 'iti', destiny: 'nubank' };
    const originCurrentValue = 2000;
    const destinyCurrentValue = 1000;

    render(
      <TransferForm data={data} onSubmmit={() => {}} onError={() => {}} />
    );

    await fillFormField('Origin Current Value', originCurrentValue);
    await fillFormField('Destiny Current Value', destinyCurrentValue);

    const form = screen.getByRole('form', { name: 'transfer' });
    fireEvent.submit(form);

    await waitFor(() => {
      const errorMessage = screen.getByText('Number must be greater than 0');
      expect(errorMessage).toBeInTheDocument();
      expect(setAssetValue).not.toBeCalled();
      expect(transfer).not.toBeCalled();
    });
  });

  it.skip('renders current origin and destiny values on field descriptions', async () => {
    // mock current asset values
    // const originCurrentValue = 12567.74;
    // const destinyCurrentValue = 357;

    render(<TransferForm onSubmmit={() => {}} onError={() => {}} />);

    const form = screen.getByRole('form', { name: 'transfer' });
    const originCurrentValueField = within(form).getByRole('spinbutton', {
      name: 'Origin Current Value',
    });
    const destinyCurrentValueField = within(form).getByRole('spinbutton', {
      name: 'Origin Current Value',
    });

    // format currency values
    expect(originCurrentValueField).toHaveAccessibleDescription(
      'Current value: R$12.567,74'
    );
    expect(destinyCurrentValueField).toHaveAccessibleDescription(
      'Current value: R$357,00'
    );
  });

  it.todo('skips setting current asset values before transfer');

  it.todo('transfers all available funds');
});
