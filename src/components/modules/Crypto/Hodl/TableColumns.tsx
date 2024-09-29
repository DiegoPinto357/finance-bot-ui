import { ColumnDef } from '@tanstack/react-table';
import {
  formatCurrency,
  formatPercentage,
  formatPrecision,
} from '@/lib/formatNumber';

import type { CryptoHodlBalanceItem } from '@/services/crypto';

const binanceTradeBaseUrl = 'https://www.binance.com/en/trade/';
const binanceTradeUrlParams = 'type=spot';

const assetsPairedWithUsdt = ['ATOM', 'FTM', 'RUNE', 'USDC', 'VET'];

export const TableColumns: ColumnDef<CryptoHodlBalanceItem>[] = [
  {
    accessorKey: 'asset',
    header: 'Asset',
    enableHiding: false,
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
  {
    accessorKey: 'portfolioScore',
    header: 'Portfolio Score',
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
    accessorKey: 'diffTokens',
    header: 'Diff Tokens',
    cell: ({ cell }) => formatPrecision(cell.getValue<number>()),
  },
];
