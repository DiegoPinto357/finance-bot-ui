import { useMemo } from 'react';
import PageHeading from '@/components/lib/PageHeading';
import Loader from '@/components/lib/Loader';
import useGetPortfolioHistory from '../useGetPortfolioHistory';
import DataTable from '@/components/DataTable';
import { TableColumns } from './TableColumns';

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

  console.log(header, rows);

  return (
    <>
      <PageHeading isRefreshing={isFetching} onRefreshClick={() => refetch()}>
        Portfolio History
      </PageHeading>
      {isLoading ? (
        <Loader />
      ) : (
        // JSON.stringify(data, null, 2)
        <DataTable
          className="mb-4"
          columns={TableColumns(header)}
          data={rows}
          columnPinning={{ left: ['date'], right: ['total', 'delta'] }}
          scrollToBottom
        />
      )}
    </>
  );
};

export default History;
