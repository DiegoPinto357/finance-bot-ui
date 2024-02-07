import { ColumnDef } from '@tanstack/react-table';
import { formatCurrency } from '@/lib/formatNumber';
import ValueCell from './ValueCell';

// TODO fetch list from server/infer from data
const assets = [
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

export type PortfolioBalanceItem = {
  portfolio: string;
  total: number;
} & Partial<Record<string, number | string>>;

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
