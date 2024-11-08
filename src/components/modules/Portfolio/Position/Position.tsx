import { useCallback, useState, useMemo } from 'react';
import Typography from '@/components/lib/Typography';
import Loader from '@/components/lib/Loader';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawerCustom';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/formatNumber';
import DataTable from '../../../DataTable';
import { TableColumns } from './TableColumns';
import OperationDialog from './OperationDialog';
import useGetportfolioBalance from '../useGetPortfolioBalance';

import type { DragAndDropInfo } from '@/components/DataTable/Cell';
import type { PortfolioBalanceItem } from './TableColumns';
import type {
  AssetBalance,
  PortfolioBalance,
} from '../../../../services/portfolio';
import type { DragAndDropOperationData } from './types';

const FIXED_HEADER_ORDER = ['nubank', 'iti'];
const STOCK_HEADER_ORDER = ['float', 'br', 'fii', 'us'];
const CRYPTO_HEADER_ORDER = ['hodl', 'backed', 'defi', 'defi2'];

const reorderAssets = (header: string[], order: string[]) => {
  const reorderedArray: string[] = [];
  const otherElements: string[] = [];

  header.forEach(element => {
    if (order.includes(element)) {
      reorderedArray.push(element);
    } else {
      otherElements.push(element);
    }
  });

  reorderedArray.sort((a, b) => order.indexOf(a) - order.indexOf(b));
  otherElements.sort();

  return [...reorderedArray, ...otherElements];
};

const mapBalance = (
  rawBalance: AssetBalance[] | undefined,
  totals: PortfolioBalanceItem,
  assets: Set<string>
) => {
  if (!rawBalance) return {};
  return rawBalance.reduce((obj, balance) => {
    const { asset, value } = balance;
    assets.add(asset);
    obj[asset] = value;

    totals[asset] =
      totals[asset] && typeof totals[asset] === 'number'
        ? (totals[asset]! as number) + value // TODO fix this type mess
        : value;
    return obj;
  }, {} as Record<string, number>);
};

const mapData = (rawData?: PortfolioBalance) => {
  if (!rawData)
    return { header: { fixed: [], stock: [], crypto: [] }, rows: [] };

  const totals: PortfolioBalanceItem = {
    portfolio: 'total',
    total: 0,
  };

  const fixedAssets = new Set<string>();
  const stockAssets = new Set<string>();
  const cryptoAssets = new Set<string>();

  const rows = Object.entries(rawData.balance).map(
    ([portfolio, { balance, total }]) => {
      const fixedBalance = mapBalance(
        balance.fixed?.balance,
        totals,
        fixedAssets
      );
      const stockBalance = mapBalance(
        balance.stock?.balance,
        totals,
        stockAssets
      );
      const cryptoBalance = mapBalance(
        balance.crypto?.balance,
        totals,
        cryptoAssets
      );

      totals['total'] = totals['total']! + total;

      return {
        portfolio,
        ...fixedBalance,
        ...stockBalance,
        ...cryptoBalance,
        total,
      } as { portfolio: string; total: number } & Record<string, number>;
    }
  );

  return {
    header: {
      fixed: reorderAssets(Array.from(fixedAssets), FIXED_HEADER_ORDER),
      stock: reorderAssets(Array.from(stockAssets), STOCK_HEADER_ORDER),
      crypto: reorderAssets(Array.from(cryptoAssets), CRYPTO_HEADER_ORDER),
    },
    rows: [...rows, totals],
  };
};

const getPortfolios = (balance: { portfolio: string }[]) =>
  balance
    .map(({ portfolio }) => portfolio)
    .filter(portfolio => portfolio !== 'total');

const Position = () => {
  // TODO use error flag
  const { data, isLoading } = useGetportfolioBalance();

  const [openOperationDialog, setOpenOperationDialog] =
    useState<boolean>(false);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [operationData, setOperationData] = useState<
    DragAndDropOperationData | undefined
  >(undefined);

  const { header, rows: mappedData } = useMemo(() => mapData(data), [data]);
  const portfolios = useMemo(() => getPortfolios(mappedData), [mappedData]);

  const handlePortfolioClick = useCallback((portfolio: string) => {
    console.log({ portfolio });
    setOpenDrawer(true);
  }, []);

  const handleCellDrop = useCallback(({ drag, drop }: DragAndDropInfo) => {
    if (drag.rowId !== drop.rowId) return;
    if (
      drag.colId.class === drop.colId.class &&
      drag.colId.name === drop.colId.name
    )
      return;

    setOperationData({
      portfolio: drag.rowId,
      originAsset: drag.colId,
      destinyAsset: drop.colId,
    });
    setOpenOperationDialog(true);
  }, []);

  return (
    <>
      <Typography variant="h1">Portfolio Position</Typography>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <DataTable
            className="mb-4"
            columns={TableColumns(header, {
              onPortfolioClick: handlePortfolioClick,
            })}
            data={mappedData}
            columnPinning={{ left: ['portfolio'], right: ['total'] }}
            onCellDrop={handleCellDrop}
          />
          <Typography variant="h3">
            Total: {formatCurrency(data?.total)}
          </Typography>
        </>
      )}

      {operationData && openOperationDialog ? (
        <OperationDialog
          open={openOperationDialog}
          operations={['swap', 'transfer']}
          operationData={operationData}
          portfolios={portfolios} // TODO consider using a context provider
          onOpenChange={setOpenOperationDialog}
        />
      ) : null}

      <Drawer direction="right" open={openDrawer} onOpenChange={setOpenDrawer}>
        <DrawerContent className="mt-0 top-0 left-auto rounded-none">
          <DrawerHeader>
            <DrawerTitle className="m-20">Title</DrawerTitle>
            <DrawerDescription>Description.</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Position;
