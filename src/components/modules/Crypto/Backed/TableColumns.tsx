import { ColumnDef } from '@tanstack/react-table';
import { formatCurrency, formatPrecision } from '@/lib/formatNumber';

import type { CryptoBalanceItem } from '@/services/crypto';

export const TableColumns: ColumnDef<CryptoBalanceItem>[] = [
  {
    accessorKey: 'asset',
    header: 'Asset',
    enableHiding: false,
    cell: ({ cell }) => cell.getValue<string>(),
  },
  {
    accessorKey: 'position',
    header: 'Position',
    cell: ({ cell }) => formatPrecision(cell.getValue<number>()),
  },
  {
    accessorKey: 'priceBRL',
    header: 'Price BRL',
    cell: ({ cell }) => formatCurrency(cell.getValue<number>()),
  },
  {
    accessorKey: 'positionBRL',
    header: 'Position BRL',
    cell: ({ cell }) => formatCurrency(cell.getValue<number>()),
  },
];
