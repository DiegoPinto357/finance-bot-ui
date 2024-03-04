import { useCallback, useState } from 'react';
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
import DataTable from '../../DataTable';
import { TableColumns } from './TableColumns';
import OperationDialog from './OperationDialog';
import useGetportfolioBalance from './useGetPortfolioBalance';

import type { DragAndDropInfo } from '@/components/DataTable/Cell';
import type { PortfolioBalanceItem } from './TableColumns';
import type {
  AssetBalance,
  PortfolioBalance,
} from '../../../services/portfolio';
import type { DragAndDropOperationData } from './types';

const mapBalance = (
  rawBalance: AssetBalance[] | undefined,
  totals: PortfolioBalanceItem
) => {
  if (!rawBalance) return {};
  return rawBalance.reduce((obj, { asset, value }) => {
    obj[asset] = value;

    totals[asset] =
      totals[asset] && typeof totals[asset] === 'number'
        ? (totals[asset]! as number) + value // TODO fix this type mess
        : value;
    return obj;
  }, {} as Record<string, number>);
};

const mapData = (rawData: PortfolioBalance) => {
  const totals: PortfolioBalanceItem = {
    portfolio: 'total',
    total: 0,
  };

  const rows = Object.entries(rawData.balance).map(
    ([portfolio, { balance, total }]) => {
      const fixedBalance = mapBalance(balance.fixed?.balance, totals);
      const stockBalance = mapBalance(balance.stock?.balance, totals);
      const cryptoBalance = mapBalance(balance.crypto?.balance, totals);

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

  return [...rows, totals];
};

const Portfolio = () => {
  // TODO use loading and error flags
  const { data, isLoading } = useGetportfolioBalance();

  const [openOperationDialog, setOpenOperationDialog] =
    useState<boolean>(false);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [operationData, setOperationData] = useState<
    DragAndDropOperationData | undefined
  >(undefined);

  const handlePortfolioClick = useCallback((portfolio: string) => {
    console.log({ portfolio });
    setOpenDrawer(true);
  }, []);

  const mappedData = data ? mapData(data) : [];

  const handleCellDrop = useCallback(({ drag, drop }: DragAndDropInfo) => {
    if (drag.rowId !== drop.rowId) return;
    if (drag.colId === drop.colId) return;

    setOperationData({
      portfolio: drag.rowId,
      originAsset: drag.colId,
      destinyAsset: drop.colId,
    });
    setOpenOperationDialog(true);
  }, []);

  return (
    <>
      <Typography variant="h1">Portfolio</Typography>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <DataTable
            className="mb-4"
            columns={TableColumns({ onPortfolioClick: handlePortfolioClick })}
            data={mappedData}
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
          operations={['transfer', 'swap']}
          operationData={operationData}
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

export default Portfolio;
