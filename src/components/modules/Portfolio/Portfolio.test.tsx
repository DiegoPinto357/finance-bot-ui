import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useGetportfolioBalance from './useGetPortfolioBalance';
import useTransfer from './useTransfer';
import useSetAssetValue from '../Fixed/useSetAssetValue';
import { triggerCellDrop } from '../../DataTable/__mocks__/DataTable';
import Portfolio from '.';
import portfolioBalance from '../../../../mockData/api/portfolio/balance';

import type { UseQueryResult } from 'react-query';
import type { PortfolioBalance } from '@/services/portfolio';

vi.mock('react-dnd');
vi.mock('./useGetPortfolioBalance');
vi.mock('./useTransfer');
vi.mock('../Fixed/useSetAssetValue');
vi.mock('../../DataTable');

const selectOperation = async (operation: 'transfer' | 'swap') => {
  const dialog = screen.getByRole('dialog', {
    name: 'Operation',
  });
  const transferTabButton = within(dialog).getByRole('tab', {
    name: operation,
  });
  await userEvent.click(transferTabButton);
};

const confirm = async (action: 'Yes' | 'No') => {
  const confirmDialog = screen.getByRole('alertdialog', { name: 'Confirm?' });
  const confirmButton = within(confirmDialog).getByRole('button', {
    name: action,
  });
  await userEvent.click(confirmButton);

  expect(confirmDialog).not.toBeVisible();
};

const fillFormField = async (
  form: HTMLElement,
  fieldName: string,
  value: string | number
) => {
  let fieldRole;
  let fieldValue;

  if (typeof value === 'number') {
    fieldRole = 'spinbutton';
    fieldValue = value.toString();
  } else {
    fieldRole = 'textbox';
    fieldValue = value;
  }

  const field = within(form).getByRole(fieldRole, {
    name: fieldName,
  });
  await userEvent.type(field, fieldValue);
};

describe('Portfolio', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('drag and drop values', () => {
    vi.mocked(useGetportfolioBalance).mockReturnValue({
      data: portfolioBalance,
    } as unknown as UseQueryResult<PortfolioBalance, unknown>);

    const transfer = vi.fn();
    /* @ts-ignore */
    vi.mocked(useTransfer).mockReturnValue({
      transfer,
    });

    const setAssetValue = vi.fn();
    /* @ts-ignore */
    vi.mocked(useSetAssetValue).mockReturnValue({ setAssetValue });

    describe('transfer values', () => {
      it('opens operation modal on drag and drop table cell', async () => {
        const portfolio = 'suricat';
        const origin = { class: 'fixed', name: 'iti' };
        const destiny = { class: 'fixed', name: 'nubank' };

        render(<Portfolio />);

        triggerCellDrop({
          drag: { colId: origin.name, rowId: portfolio },
          drop: { colId: destiny.name, rowId: portfolio },
        });

        const operationDialog = screen.getByRole('dialog', {
          name: 'Operation',
        });

        expect(operationDialog).toBeVisible();
      });

      it('does not transfer value if user do not confirm it on confirm dialog', async () => {
        const portfolio = 'suricat';
        const origin = { class: 'fixed', name: 'iti' };
        const destiny = { class: 'fixed', name: 'nubank' };
        const value = 100;

        render(<Portfolio />);

        triggerCellDrop({
          drag: { colId: origin.name, rowId: portfolio },
          drop: { colId: destiny.name, rowId: portfolio },
        });

        await selectOperation('transfer');

        const transferForm = screen.getByRole('form', { name: 'transfer' });
        await fillFormField(transferForm, 'Origin Current Value', 2000);
        await fillFormField(transferForm, 'Destiny Current Value', 1000);
        await fillFormField(transferForm, 'Value', value);

        const submitButton = screen.getByRole('button', {
          name: 'Submit',
        });
        await userEvent.click(submitButton);

        await confirm('No');

        const operationDialog = screen.getByRole('dialog', {
          name: 'Operation',
        });
        expect(operationDialog).toBeVisible();

        expect(setAssetValue).not.toBeCalled();
        expect(transfer).not.toBeCalled();
      });

      it('renders error message if server fails', async () => {
        const portfolio = 'suricat';
        const origin = { class: 'fixed', name: 'iti' };
        const destiny = { class: 'fixed', name: 'nubank' };
        const value = 100;

        transfer.mockRejectedValueOnce(new Error('Error message!'));

        render(<Portfolio />);

        triggerCellDrop({
          drag: { colId: origin.name, rowId: portfolio },
          drop: { colId: destiny.name, rowId: portfolio },
        });

        await selectOperation('transfer');

        const transferForm = screen.getByRole('form', { name: 'transfer' });
        await fillFormField(transferForm, 'Origin Current Value', 2000);
        await fillFormField(transferForm, 'Destiny Current Value', 1000);
        await fillFormField(transferForm, 'Value', value);

        const submitButton = screen.getByRole('button', {
          name: 'Submit',
        });
        await userEvent.click(submitButton);

        await confirm('Yes');

        const operationDialog = screen.getByRole('dialog', {
          name: 'Operation',
        });
        expect(operationDialog).toBeInTheDocument();

        const errorMessage =
          within(operationDialog).getByText('Error message!');
        expect(errorMessage).toBeInTheDocument();

        // FIXME
        // error message should be clear when open dialog again
        // triggerCellDrop({
        //   drag: { colId: origin.name, rowId: portfolio },
        //   drop: { colId: destiny.name, rowId: portfolio },
        // });
        // expect(errorMessage).not.toBeInTheDocument();
      });

      it('does not open operations dialog to operate across portfolios', async () => {
        const originPortfolio = 'amortecedor';
        const destinyPortfolio = 'previdencia';
        const origin = { class: 'fixed', name: 'iti' };
        const destiny = { class: 'fixed', name: 'nubank' };

        render(<Portfolio />);

        triggerCellDrop({
          drag: { colId: origin.name, rowId: originPortfolio },
          drop: { colId: destiny.name, rowId: destinyPortfolio },
        });

        const dialog = screen.queryByRole('dialog', {
          name: 'Operation',
        });
        expect(dialog).not.toBeInTheDocument();

        // TODO render a warning message?
      });

      it.todo('does not transfer value on stock and crypto - TEMP');
    });

    describe('swap values', () => {
      it.todo('transfers value between assets within portfolio');
      it.todo('handles error from server');
      it.todo('does ot swap vlues across portfolios');
    });
  });
});
