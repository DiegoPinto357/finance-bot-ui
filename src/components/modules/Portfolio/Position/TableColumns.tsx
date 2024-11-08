import { ColumnDef } from '@tanstack/react-table';
import { formatCurrency } from '@/lib/formatNumber';
import ValueCell from './ValueCell';

import type { AssetClass } from '@/types';

export type PortfolioBalanceItem = {
  portfolio: string;
  total: number;
} & Partial<Record<string, number | string>>;

const buildCells = (assets: string[], assetClass: AssetClass) =>
  assets.map(
    asset =>
      ({
        id: `${assetClass}:${asset}`,
        accessorKey: asset,
        header: asset,
        cell: ({ row, cell }) => (
          <ValueCell
            portfolio={row.getValue('portfolio')}
            asset={{ class: assetClass, name: asset }}
          >
            {formatCurrency(cell.getValue<number>())}
          </ValueCell>
        ),
      } as ColumnDef<PortfolioBalanceItem>)
  );

type Params = {
  onPortfolioClick?: (portfolio: string) => void;
};

export const TableColumns = (
  assets: Record<AssetClass, string[]>,
  params?: Params
): ColumnDef<PortfolioBalanceItem>[] => [
  {
    accessorKey: 'portfolio',
    header: 'Portfolio',
    cell: ({ cell }) => {
      const value = cell.getValue<string>();
      return (
        <button
          onClick={() => {
            if (params?.onPortfolioClick) {
              params.onPortfolioClick(value);
            }
          }}
        >
          {value}
        </button>
      );
    },
  },

  ...buildCells(assets.fixed, 'fixed'),
  ...buildCells(assets.stock, 'stock'),
  ...buildCells(assets.crypto, 'crypto'),

  {
    accessorKey: 'total',
    header: 'Total',
    cell: ({ cell }) => (
      <div className="text-right">
        {formatCurrency(cell.getValue<number>())}
      </div>
    ),
  },
];
