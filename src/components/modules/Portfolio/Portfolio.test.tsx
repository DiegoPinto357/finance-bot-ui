import {
  render,
  screen,
  within,
  waitFor,
  fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useGetportfolioBalance from './useGetPortfolioBalance';
import useTransfer from './useTransfer';
import { triggerCellDrop } from '../../DataTable/__mocks__/DataTable';
import Portfolio from '.';
import portfolioBalance from '../../../../mockData/api/portfolio/balance';

import type { UseQueryResult } from 'react-query';
import type { PortfolioBalance } from '@/services/portfolio';

vi.mock('react-dnd');
vi.mock('./useGetPortfolioBalance');
vi.mock('./useTransfer');
vi.mock('../../DataTable');

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
        const valueField = within(transferForm).getByRole('spinbutton', {
          name: 'Value',
        });
        await userEvent.type(valueField, value.toString());

        await waitFor(() => {
          fireEvent.submit(transferForm);
        });

        expect(transfer).toBeCalledTimes(1);
        expect(transfer).toBeCalledWith({ portfolio, origin, destiny, value });
      });

      it.todo('does not trasfer value across portfolios');
    });

    describe('swap values', () => {
      it.todo('transfers value between assets within portfolio');
      it.todo('does ot swap vlues across portfolios');
    });
  });
});
