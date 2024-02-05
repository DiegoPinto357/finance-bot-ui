import { useQuery } from 'react-query';
import Typography from '@/components/Typography';
import DataTable from '../../DataTable';
import { formatCurrency } from '@/lib/formatNumber';
import { TableColumns } from './TableColumns';
import portfolioService from '../../../services/portfolio';

import type { PortfolioBalance } from '../../../services/portfolio';

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

  const mappedData = data ? mapData(data) : [];

  return (
    <>
      <Typography variant="h1">Portfolio</Typography>
      <DataTable className="mb-4" columns={TableColumns} data={mappedData} />
      <Typography variant="h3">Total: {formatCurrency(data?.total)}</Typography>
    </>
  );
};

export default Portfolio;
