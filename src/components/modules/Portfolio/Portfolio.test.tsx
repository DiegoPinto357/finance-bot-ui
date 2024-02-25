import { render, screen } from '@testing-library/react';
import { triggerCellDrop } from '../../DataTable/__mocks__/DataTable';
import Portfolio from '.';

vi.mock('react-dnd');
vi.mock('./useGetPortfolioBalance');
vi.mock('./useTransfer');
vi.mock('../Fixed/useGetFixedBalance');
vi.mock('../Fixed/useSetAssetValue');
vi.mock('../../DataTable');

describe('Portfolio', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('drag and drop values', () => {
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
