import { ColumnDef } from '@tanstack/react-table';
import { formatCurrency } from '@/lib/formatNumber';

const buildClickableHeader = (
  headerLabel: string,
  onPortfolioClick?: (portfolio: string) => void
) => {
  return (
    <button
      onClick={() => {
        if (onPortfolioClick) {
          onPortfolioClick(headerLabel);
        }
      }}
    >
      {headerLabel}
    </button>
  );
};

type PortfolioHistoryItem = {
  date: string;
} & Record<string, string | number>;

type Params = {
  onPortfolioClick?: (portfolio: string) => void;
};

export const TableColumns = (
  header: string[],
  params?: Params
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
        header: () =>
          buildClickableHeader(headerItem, params?.onPortfolioClick),
        accessorKey: headerItem,
        cell: ({ cell }) => {
          const value = cell.getValue<number>();
          return formatCurrency(value);
        },
      } as ColumnDef<PortfolioHistoryItem>)
  ),

  {
    accessorKey: 'total',
    header: () => buildClickableHeader('Total', params?.onPortfolioClick),
    cell: ({ cell }) => (
      <div className="text-right">
        {formatCurrency(cell.getValue<number>())}
      </div>
    ),
  },

  {
    accessorKey: 'delta',
    header: () => buildClickableHeader('Delta', params?.onPortfolioClick),
    cell: ({ cell }) => (
      <div className="text-right">
        {formatCurrency(cell.getValue<number>())}
      </div>
    ),
  },
];
