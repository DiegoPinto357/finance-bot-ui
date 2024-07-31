import { render, screen, within } from '@testing-library/react';
import { triggerCellDrop } from '../../DataTable/__mocks__/DataTable';
import Portfolio from '.';

import type { Asset } from '@/types';

vi.mock('react-dnd');
vi.mock('./useGetPortfolioBalance');
vi.mock('./useTransfer');
vi.mock('./useSwap');
vi.mock('../Fixed/getFixedBalance');
vi.mock('../Fixed/setFixedAssetValue');
vi.mock('../Stock/setStockAssetValue');
vi.mock('../../DataTable');

describe('Portfolio', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('drag and drop values', () => {
    it('opens operation modal on drag and drop table cell for fixed assets', async () => {
      const portfolio = 'suricat';
      const origin: Asset = { class: 'fixed', name: 'iti' };
      const destiny: Asset = { class: 'fixed', name: 'nubank' };

      render(<Portfolio />);

      triggerCellDrop({
        drag: { colId: origin, rowId: portfolio },
        drop: { colId: destiny, rowId: portfolio },
      });

      const operationDialog = screen.getByRole('dialog', {
        name: 'Operation',
      });
      const originCurrentValue = await within(operationDialog).findByText(
        'Current value: R$ 6.943,70'
      );
      const destinyCurrentValue = await within(operationDialog).findByText(
        'Current value: R$ 12.340,05'
      );

      expect(operationDialog).toBeVisible();
      expect(originCurrentValue).toBeInTheDocument();
      expect(destinyCurrentValue).toBeInTheDocument();
    });

    it('opens operation modal on drag and drop table cell for fixed and stock assets', async () => {
      const portfolio = 'suricat';
      const origin: Asset = { class: 'fixed', name: 'iti' };
      const destiny: Asset = { class: 'stock', name: 'float' };

      render(<Portfolio />);

      triggerCellDrop({
        drag: { colId: origin, rowId: portfolio },
        drop: { colId: destiny, rowId: portfolio },
      });

      const operationDialog = screen.getByRole('dialog', {
        name: 'Operation',
      });
      const originCurrentValue = await within(operationDialog).findByText(
        'Current value: R$ 6.943,70'
      );
      const destinyCurrentValue = await within(operationDialog).findByText(
        'Current value: R$ 10,14'
      );

      expect(operationDialog).toBeVisible();
      expect(originCurrentValue).toBeInTheDocument();
      expect(destinyCurrentValue).toBeInTheDocument();
    });

    it('opens operation modal on drag and drop table cell for fixed and crypto assets', async () => {
      const portfolio = 'suricat';
      const origin: Asset = { class: 'fixed', name: 'iti' };
      const destiny: Asset = { class: 'crypto', name: 'hodl' };

      render(<Portfolio />);

      triggerCellDrop({
        drag: { colId: origin, rowId: portfolio },
        drop: { colId: destiny, rowId: portfolio },
      });

      const operationDialog = screen.getByRole('dialog', {
        name: 'Operation',
      });
      const originCurrentValue = await within(operationDialog).findByText(
        'Current value: R$ 6.943,70'
      );

      expect(operationDialog).toBeVisible();
      expect(originCurrentValue).toBeInTheDocument();
    });

    it('does not open operations dialog to operate across portfolios', async () => {
      const originPortfolio = 'amortecedor';
      const destinyPortfolio = 'previdencia';
      const origin: Asset = { class: 'fixed', name: 'iti' };
      const destiny: Asset = { class: 'fixed', name: 'nubank' };

      render(<Portfolio />);

      triggerCellDrop({
        drag: { colId: origin, rowId: originPortfolio },
        drop: { colId: destiny, rowId: destinyPortfolio },
      });

      const operationDialog = screen.queryByRole('dialog', {
        name: 'Operation',
      });
      expect(operationDialog).not.toBeInTheDocument();

      // TODO render a warning message?
    });

    it('does not open operations dialog if origin and destiny assets are the same', () => {
      const portfolio = 'suricat';
      const origin: Asset = { class: 'fixed', name: 'iti' };
      const destiny: Asset = { class: 'fixed', name: 'iti' };

      render(<Portfolio />);

      triggerCellDrop({
        drag: { colId: origin, rowId: portfolio },
        drop: { colId: destiny, rowId: portfolio },
      });

      const operationDialog = screen.queryByRole('dialog', {
        name: 'Operation',
      });
      expect(operationDialog).not.toBeInTheDocument();
    });

    it.todo(
      'does not open operations dialog when cell is dropped on "portfolio" col'
    );
    it.todo(
      'does not open operations dialog when cell is dropped on "total" col'
    );
  });
});
