import { ColumnDef, sortingFns } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

import {
  CaretSortIcon,
  CaretUpIcon,
  CaretDownIcon,
} from '@radix-ui/react-icons';

import { formatCurrency, formatPercentage } from '@/lib/formatNumber';

import type {
  CellContext,
  HeaderContext,
  SortingFn,
} from '@tanstack/react-table';
import type { PortfolioLiquidity } from '@/services/portfolio';

const customSorting: SortingFn<PortfolioLiquidity> = (rowA, rowB, columnId) => {
  const isRowATotal = rowA.original.portfolio === 'total';
  const isRowBTotal = rowB.original.portfolio === 'total';

  if (isRowATotal) return 1;
  if (isRowBTotal) return -1;

  return sortingFns.basic(rowA, rowB, columnId);
};

type BuildSortableHeaderOptions = {
  lastColAlignToRight: boolean;
};

// TODO duplication on crypto backed
const buildSortableHeader =
  (label: string, options?: BuildSortableHeaderOptions) =>
  ({ column }: HeaderContext<PortfolioLiquidity, unknown>) => {
    const sortedState = column.getIsSorted();

    const Icon =
      sortedState === 'asc'
        ? CaretUpIcon
        : sortedState === 'desc'
        ? CaretDownIcon
        : CaretSortIcon;

    const alignStyleClass =
      options?.lastColAlignToRight && column.getIsLastColumn() ? 'ml-auto' : '';

    return (
      <Button
        className={`p-0 ${alignStyleClass}`}
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        {label}
        <Icon className="ml-2 h-4 w-4" />
      </Button>
    );
  };

const buildRatioCell = ({ cell }: CellContext<PortfolioLiquidity, unknown>) => {
  const value = cell.getValue<number>();
  return (
    <div className="flex gap-2 justify-between items-center">
      <Progress className="basis-[70%]" value={value * 100} />
      {formatPercentage(value)}
    </div>
  );
};

export const TableColumns: ColumnDef<PortfolioLiquidity>[] = [
  {
    accessorKey: 'portfolio',
    header: 'Portfolio',
  },
  {
    accessorKey: 'liquidityValue',
    header: buildSortableHeader('Liquidity Value'),
    cell: ({ cell }) => formatCurrency(cell.getValue<number>()),
    sortingFn: customSorting,
  },
  {
    accessorKey: 'liquidityRatio',
    header: buildSortableHeader('Liquidity Ratio'),
    cell: buildRatioCell,
    sortingFn: customSorting,
  },
  {
    accessorKey: 'totalValue',
    header: buildSortableHeader('Total Value', { lastColAlignToRight: true }),
    cell: ({ cell }) => (
      <div className="text-right">
        {formatCurrency(cell.getValue<number>())}
      </div>
    ),
    sortingFn: customSorting,
  },
];
