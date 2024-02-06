import { useQuery } from 'react-query';
import Typography from '@/components/Typography';
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
import portfolioService from '../../../services/portfolio';

import type { PortfolioBalance } from '../../../services/portfolio';
import { useCallback, useState } from 'react';

const mapBalance = (rawBalance: { asset: string; value: number }[]) =>
  rawBalance.reduce((obj, item) => {
    obj[item.asset] = item.value;
    return obj;
  }, {} as Record<string, number>);

const mapData = (rawData: PortfolioBalance) => {
  return Object.entries(rawData.balance).map(
    ([portfolio, { balance, total }]) => {
      const fixedBalance = balance.fixed
        ? mapBalance(balance.fixed?.balance)
        : {};

      const stockBalance = balance.stock
        ? mapBalance(balance.stock?.balance)
        : {};

      const cryptoBalance = balance.crypto
        ? mapBalance(balance.crypto?.balance)
        : {};

      return {
        portfolio,
        ...fixedBalance,
        ...stockBalance,
        ...cryptoBalance,
        total,
      } as { portfolio: string; total: number } & Record<string, number>;
    }
  );
};

const Portfolio = () => {
  // TODO use loading and error flags
  const { data } = useQuery('portfolioBalance', () =>
    portfolioService.getBalance()
  );

  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  const handlePortfolioClick = useCallback((portfolio: string) => {
    console.log({ portfolio });
    setOpenDrawer(true);
  }, []);

  const mappedData = data ? mapData(data) : [];

  return (
    <>
      <Typography variant="h1">Portfolio</Typography>
      <DataTable
        className="mb-4"
        columns={TableColumns({ onPortfolioClick: handlePortfolioClick })}
        data={mappedData}
      />
      <Typography variant="h3">Total: {formatCurrency(data?.total)}</Typography>

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
