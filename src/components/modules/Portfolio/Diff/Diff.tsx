import { useMemo } from 'react';
import PageHeading from '@/components/lib/PageHeading';
import Loader from '@/components/lib/Loader';
import DataTable from '@/components/DataTable';
import { TableColumns } from './TableColumns';
import useGetPortfolioShares from '../useGetPortfolioShares';

import type { PortfolioShares } from '@/services/portfolio';
import type { PortfolioDiffItem } from './TableColumns';

const mapData = (rawData?: PortfolioShares) => {
  if (!rawData) return { header: [], rows: [] };

  const header: string[] = [];

  const rows = rawData.shares.map(({ shares, portfolio }) => {
    const row: PortfolioDiffItem = { portfolio };
    shares.forEach(share => {
      const { assetClass, asset, diffBRL } = share;

      if (diffBRL === 0) return;

      const headerLabel = asset || assetClass;
      if (!header.includes(headerLabel)) {
        header.push(headerLabel);
      }
      row[headerLabel] = -diffBRL;
    });

    return row;
  });

  return { header, rows };
};

const Diff = () => {
  const { data, isLoading, isFetching, refetch } = useGetPortfolioShares();
  const { header, rows: mappedData } = useMemo(() => mapData(data), [data]);

  return (
    <>
      <PageHeading isRefreshing={isFetching} onRefreshClick={() => refetch()}>
        Portfolio Diff
      </PageHeading>
      {isLoading ? (
        <Loader />
      ) : (
        <DataTable
          className="mb-4"
          columns={TableColumns(header, mappedData)}
          data={mappedData}
          columnPinning={{ left: ['portfolio'], right: ['total'] }}
          cellStyle={{ classname: 'p-0 pr-[0.5px]', excludeFirstCol: true }}
        />
      )}
    </>
  );
};

export default Diff;
