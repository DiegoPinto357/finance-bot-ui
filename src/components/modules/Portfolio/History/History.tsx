import { useMemo, useState } from 'react';
import PageHeading from '@/components/lib/PageHeading';
import Loader from '@/components/lib/Loader';
import useGetPortfolioHistory from '../useGetPortfolioHistory';
import DataTable from '@/components/DataTable';
import { TableColumns } from './TableColumns';
import ChartDialog from './ChartDialog';

import type { PortfolioHistory } from '@/services/portfolio';

const mapData = (data?: PortfolioHistory) => {
  if (!data) {
    return { header: [], rows: [] };
  }

  const headerSet = new Set<string>();

  let lastTotal = 0;

  const rows = data.map(({ date, portfolios }) => {
    let total = 0;
    Object.entries(portfolios).forEach(([key, value]) => {
      total += value;
      return headerSet.add(key);
    });
    const delta = total - lastTotal;
    lastTotal = total;
    return { date, ...portfolios, total, delta };
  });

  return { header: Array.from(headerSet), rows };
};

const History = () => {
  const { data, isLoading, isFetching, refetch } = useGetPortfolioHistory();
  const { header, rows } = useMemo(() => mapData(data), [data]);

  const [chartOpen, setChartOpen] = useState<boolean>(false);
  const [chartPortfolio, setChartPortfolio] = useState<string>('');

  const handlePortfolioClick = (portfolio: string) => {
    setChartPortfolio(portfolio);
    setChartOpen(true);
  };

  return (
    <>
      <PageHeading isRefreshing={isFetching} onRefreshClick={() => refetch()}>
        Portfolio History
      </PageHeading>
      {isLoading ? (
        <Loader />
      ) : (
        <DataTable
          className="mb-4"
          columns={TableColumns(header, {
            onPortfolioClick: handlePortfolioClick,
          })}
          data={rows}
          columnPinning={{ left: ['date'], right: ['total', 'delta'] }}
          scrollToBottom
        />
      )}

      {chartOpen ? (
        <ChartDialog
          open={chartOpen}
          title={chartPortfolio}
          data={rows}
          onOpenChange={setChartOpen}
        />
      ) : null}
    </>
  );
};

export default History;
