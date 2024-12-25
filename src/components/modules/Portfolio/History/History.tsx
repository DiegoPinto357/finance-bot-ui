import { useMemo, useState } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeading from '@/components/lib/PageHeading';
import Loader from '@/components/lib/Loader';
import ConfirmDialog from '@/components/lib/ConfirmDialog';
import useGetPortfolioHistory from '../useGetPortfolioHistory';
import useSetPortfolioHistory from '../useSetPortfolioHistory';
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

  const [scrollToBottomTrigger, setScrollToBottomTrigger] =
    useState<boolean>(false);

  const { setPortfolioHistory, isLoading: isSettingEntry } =
    useSetPortfolioHistory();

  const [confirmAddOpen, setConfirmAddOpen] = useState<boolean>(false);

  const [chartOpen, setChartOpen] = useState<boolean>(false);
  const [chartPortfolio, setChartPortfolio] = useState<string>('');

  const handlePortfolioClick = (portfolio: string) => {
    setChartPortfolio(portfolio);
    setChartOpen(true);
  };

  const handleAddRecordConfirm = async () => {
    await setPortfolioHistory();
    await refetch();
    setScrollToBottomTrigger(prev => !prev);
  };

  return (
    <>
      <PageHeading isRefreshing={isFetching} onRefreshClick={() => refetch()}>
        Portfolio History
      </PageHeading>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Button
            className="mb-4"
            variant="default"
            disabled={isSettingEntry}
            onClick={() => setConfirmAddOpen(true)}
          >
            {isSettingEntry ? <Loader2 className="animate-spin" /> : <Plus />}
            Add New Balance Record
          </Button>
          <DataTable
            className="mb-4"
            columns={TableColumns(header, {
              onPortfolioClick: handlePortfolioClick,
            })}
            data={rows}
            columnPinning={{ left: ['date'], right: ['total', 'delta'] }}
            scrollToBottom
            scrollToBottomTrigger={scrollToBottomTrigger}
          />
        </div>
      )}

      {confirmAddOpen ? (
        <ConfirmDialog
          open={confirmAddOpen}
          onOpenChange={setConfirmAddOpen}
          onConfirm={handleAddRecordConfirm}
        />
      ) : null}

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
