import { render, screen } from '@testing-library/react';
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

    it.todo('does not open operations dialog on stock and crypto - TEMP');
  });
});
