import { render } from '@testing-library/react';
import useGetportfolioBalance from './useGetPortfolioBalance';
import { triggerCellDrop } from '../../DataTable/__mocks__/DataTable';
import Portfolio from '.';
import portfolioBalance from '../../../../mockData/api/portfolio/balance';

import type { UseQueryResult } from 'react-query';
import type { PortfolioBalance } from '@/services/portfolio';

vi.mock('react-dnd');
vi.mock('./useGetPortfolioBalance');
vi.mock('../../DataTable');

describe('Portfolio', () => {
  describe('drag and drop values', () => {
    describe('transfer values', () => {
      it('transfers value between assets within portfolio', () => {
        vi.mocked(useGetportfolioBalance).mockReturnValue({
          data: portfolioBalance,
        } as unknown as UseQueryResult<PortfolioBalance, unknown>);
        render(<Portfolio />);
        triggerCellDrop({
          drag: { colId: 'iti', rowId: 'suricat' },
          drop: { colId: 'nubank', rowId: 'suricat' },
        });
      });
      it.todo('does not trasfer value across portfolios');
    });

    describe('swap values', () => {
      it.todo('transfers value between assets within portfolio');
      it.todo('does ot swap vlues across portfolios');
    });
  });
});
