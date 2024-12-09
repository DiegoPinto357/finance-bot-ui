import { ColumnDef } from '@tanstack/react-table';
import { formatCurrency } from '@/lib/formatNumber';

type PortfolioHistoryItem = {
  date: string;
} & Record<string, string | number>;

export const TableColumns = (
  header: string[]
): ColumnDef<PortfolioHistoryItem>[] => [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ cell }) => {
      const rawDate = cell.getValue<string>();
      const [year, month, day] = rawDate.split('-');
      return `${day}/${month}/${year}`;
    },
  },

  ...header.map(
    headerItem =>
      ({
        header: headerItem,
        accessorKey: headerItem,
        cell: ({ cell }) => {
          const value = cell.getValue<number>();
          return formatCurrency(value);
        },
      } as ColumnDef<PortfolioHistoryItem>)
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

  {
    accessorKey: 'delta',
    header: 'Delta',
    cell: ({ cell }) => (
      <div className="text-right">
        {formatCurrency(cell.getValue<number>())}
      </div>
    ),
  },
];
