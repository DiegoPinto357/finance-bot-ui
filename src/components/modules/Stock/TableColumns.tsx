import { ColumnDef } from '@tanstack/react-table';
import {
  formatCurrency,
  formatPercentage,
  formatPrecision,
} from '@/lib/formatNumber';

import type { StockBrBalanceItem } from '@/services/stock';

export const TableColumns: ColumnDef<StockBrBalanceItem>[] = [
  {
    accessorKey: 'asset',
    header: 'Asset',
    enableHiding: false,
    cell: ({ cell }) => cell.getValue<string>(),
  },
  {
    accessorKey: 'score',
    header: 'Score',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
  },
  {
    accessorKey: 'change',
    header: 'Change',
    cell: ({ cell }) => formatPercentage(cell.getValue<number>()),
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ cell }) => formatCurrency(cell.getValue<number>()),
  },
  {
    accessorKey: 'positionBRL',
    header: 'Position BRL',
    cell: ({ cell }) => formatCurrency(cell.getValue<number>()),
  },
  {
    accessorKey: 'positionTarget',
    header: 'Position Target',
    cell: ({ cell }) => formatPercentage(cell.getValue<number>()),
  },
  {
    accessorKey: 'position',
    header: 'Position',
    cell: ({ cell }) => formatPercentage(cell.getValue<number>()),
  },
  {
    accessorKey: 'positionDiff',
    header: 'Position Diff',
    cell: ({ cell }) => formatPercentage(cell.getValue<number>()),
  },
  {
    accessorKey: 'diffBRL',
    header: 'Diff BRL',
    cell: ({ cell }) => formatCurrency(cell.getValue<number>()),
  },
  {
    accessorKey: 'diffAmount',
    header: 'Diff Amount',
    cell: ({ cell }) => formatPrecision(cell.getValue<number>()),
  },
];
