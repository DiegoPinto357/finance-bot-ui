import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  CaretSortIcon,
  CaretUpIcon,
  CaretDownIcon,
} from '@radix-ui/react-icons';

import { formatCurrency, formatPrecision } from '@/lib/formatNumber';

import type { HeaderContext } from '@tanstack/react-table';
import type { CryptoBalanceItem } from '@/services/crypto';

// TODO duplication on portfolio liquidity
const getSortableHeader =
  (label: string) =>
  ({ column }: HeaderContext<CryptoBalanceItem, unknown>) => {
    const sortedState = column.getIsSorted();

    const Icon =
      sortedState === 'asc'
        ? CaretUpIcon
        : sortedState === 'desc'
        ? CaretDownIcon
        : CaretSortIcon;

    return (
      <Button
        className="p-0"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        {label}
        <Icon className="ml-2 h-4 w-4" />
      </Button>
    );
  };

export const TableColumns: ColumnDef<CryptoBalanceItem>[] = [
  {
    accessorKey: 'asset',
    header: getSortableHeader('Asset'),
    enableHiding: false,
  },
  {
    accessorKey: 'position',
    header: getSortableHeader('Position'),
    cell: ({ cell }) => formatPrecision(cell.getValue<number>()),
  },
  {
    accessorKey: 'priceBRL',
    header: getSortableHeader('Price BRL'),
    cell: ({ cell }) => formatCurrency(cell.getValue<number>()),
  },
  {
    accessorKey: 'positionBRL',
    header: getSortableHeader('Position BRL'),
    cell: ({ cell }) => formatCurrency(cell.getValue<number>()),
  },
];
