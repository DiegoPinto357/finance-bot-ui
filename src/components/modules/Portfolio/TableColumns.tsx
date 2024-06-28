import { ColumnDef } from '@tanstack/react-table';
import { formatCurrency } from '@/lib/formatNumber';
import ValueCell from './ValueCell';

export type PortfolioBalanceItem = {
  portfolio: string;
  total: number;
} & Partial<Record<string, number | string>>;

type Params = {
  onPortfolioClick?: (portfolio: string) => void;
};

export const TableColumns = (
  assets: string[],
  params?: Params
): ColumnDef<PortfolioBalanceItem>[] => [
  {
    accessorKey: 'portfolio',
    header: 'Portfolio',
    enablePinning: true,
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

  ...assets.map(
    asset =>
      ({
        accessorKey: asset,
        header: asset,
        cell: ({ row, cell }) => (
          <ValueCell portfolio={row.getValue('portfolio')} asset={asset}>
            {formatCurrency(cell.getValue<number>())}
          </ValueCell>
        ),
      } as ColumnDef<PortfolioBalanceItem>)
  ),

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
