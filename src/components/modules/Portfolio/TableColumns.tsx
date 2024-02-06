import { ColumnDef } from '@tanstack/react-table';
import { formatCurrency } from '@/lib/formatNumber';

// TOdo fetch list from server/infer from data
const portfolios = [
  'nubank',
  'iti',
  '99pay',
  'inco',
  'xpWesternAsset',
  'xpTrendInvestback',
  'daycovalCDB110',
  'daycovalCDBCDI1_2',
  'nuInvestCDB8_5',
  'nuInvestCDB9_5',
  'nuInvestCDB12_5',
  'nuInvestCBDIPCA5_5',
  'nuInvestTDIPCA2035',
  'nuInvestTDPre2029',
  'nuInvestTDIPCA2045',
  'sofisaCDBMax60',
  'sofisaCDB110',
  'sofisaCDBIPCA7_5',
  'interArcaPGBL',
  'float',
  'br',
  'us',
  'fii',
  'binanceBuffer',
  'hodl',
  'backed',
  'defi',
  'defi2',
];

type PortfolioBalanceItem = {
  portfolio: string;
  total: number;
} & Record<string, number>;

type Params = {
  onPortfolioClick?: (portfolio: string) => void;
};

export const TableColumns = (
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

  ...portfolios.map(
    portfolio =>
      ({
        accessorKey: portfolio,
        header: portfolio,
        cell: ({ cell }) => (
          <div className="text-right">
            {formatCurrency(cell.getValue<number>())}
          </div>
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
