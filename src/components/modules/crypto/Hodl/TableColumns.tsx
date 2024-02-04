import { ColumnDef } from '@tanstack/react-table';

export type CryptoHodlBalanceItem = {
  asset: string;
  spot: number;
  earn: number;
  total: number;
  portfolioScore: number;
  priceBRL: number;
  positionBRL: number;
  positionTarget: number;
  position: number;
  positionDiff: number;
  diffBRL: number;
  diffTokens: number;
};

const binanceTradeBaseUrl = 'https://www.binance.com/en/trade/';
const binanceTradeUrlParams = 'type=spot';

const assetsPairedWithUsdt = ['ATOM', 'FTM', 'RUNE', 'USDC', 'VET'];

// TODO move format functions to utils lib (formatNumber?)
const formatPrecision = (value: number) => value.toPrecision(5);

const formatCurreny = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

const formatPercentage = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export const TableColumns: ColumnDef<CryptoHodlBalanceItem>[] = [
  {
    accessorKey: 'asset',
    header: 'Asset',
    cell: ({ cell }) => {
      const asset = cell.getValue<string>();

      if (asset === 'BRL') return asset;

      const baseAsset = assetsPairedWithUsdt.includes(asset) ? 'USDT' : 'BRL';
      const pair = `${asset}_${baseAsset}`;
      const url = `${binanceTradeBaseUrl}${pair}?${binanceTradeUrlParams}`;

      return (
        <a
          // TODO create global link class
          className="text-primary underline-offset-4 hover:underline"
          href={url}
          target="_blank"
        >
          {asset}
        </a>
      );
    },
  },
  {
    accessorKey: 'spot',
    header: 'Spot',
    cell: ({ cell }) => formatPrecision(cell.getValue<number>()),
  },
  {
    accessorKey: 'earn',
    header: 'Earn',
    cell: ({ cell }) => formatPrecision(cell.getValue<number>()),
  },
  {
    accessorKey: 'total',
    header: 'Total',
    cell: ({ cell }) => formatPrecision(cell.getValue<number>()),
  },
  { accessorKey: 'portfolioScore', header: 'Portfolio Score' },
  {
    accessorKey: 'priceBRL',
    header: 'Price BRL',
    cell: ({ cell }) => formatCurreny(cell.getValue<number>()),
  },
  {
    accessorKey: 'positionBRL',
    header: 'Position BRL',
    cell: ({ cell }) => formatCurreny(cell.getValue<number>()),
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
    cell: ({ cell }) => formatCurreny(cell.getValue<number>()),
  },
  {
    accessorKey: 'diffTokens',
    header: 'Diff Tokens',
    cell: ({ cell }) => formatPrecision(cell.getValue<number>()),
  },
];
