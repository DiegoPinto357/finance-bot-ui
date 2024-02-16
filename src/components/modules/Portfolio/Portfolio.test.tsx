import { render, screen, within, fireEvent } from '@testing-library/react';
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
  describe('drag and drop values', () => {
    describe('transfer values', () => {
      it('transfers value between assets within portfolio', async () => {
        const portfolio = 'suricat';
        const origin = { class: 'fixed', name: 'iti' };
        const destiny = { class: 'fixed', name: 'nubank' };
        const value = 100;

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

        render(<Portfolio />);

        triggerCellDrop({
          drag: { colId: origin.name, rowId: portfolio },
          drop: { colId: destiny.name, rowId: portfolio },
        });

        const dialog = await screen.findByRole('dialog', {
          name: 'Operation',
        });
        const transferTabButton = within(dialog).getByRole('tab', {
          name: 'transfer',
        });
        userEvent.click(transferTabButton);

        const transferForm = screen.getByRole('form', { name: 'transfer' });
        await fillFormField(transferForm, 'Origin Current Value', 2000);
        await fillFormField(transferForm, 'Destiny Current Value', 1000);
        await fillFormField(transferForm, 'Value', value);

        const submitButton = within(dialog).getByRole('button', {
          name: 'Submit',
        });
        await userEvent.click(submitButton);
        fireEvent.submit(transferForm);

        // click to confirm on confirmation dialog
        // expect confirm dialog to be closed

        expect(dialog).not.toBeVisible();

        expect(setAssetValue).toBeCalledTimes(2);
        expect(setAssetValue).toBeCalledWith({ asset: 'iti', value: 2000 });
        expect(setAssetValue).toBeCalledWith({ asset: 'nubank', value: 1000 });

        expect(transfer).toBeCalledTimes(1);
        expect(transfer).toBeCalledWith({ portfolio, origin, destiny, value });
      });

      it.todo('handles error from server');

      it.todo('does not trasfer value across portfolios');
    });

    describe('swap values', () => {
      it.todo('transfers value between assets within portfolio');
      it.todo('handles error from server');
      it.todo('does ot swap vlues across portfolios');
    });
  });
});
