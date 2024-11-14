import { useMemo } from 'react';
import Typography from '@/components/lib/Typography';
import Loader from '@/components/lib/Loader';
import DataTable from '@/components/DataTable';
import { TableColumns } from './TableColumns';
import useGetPortfolioShares from '../useGetPortfolioShares';

import type { PortfolioShares } from '@/services/portfolio';
import type { PortfolioDiffItem } from './TableColumns';

const mapData = (rawData?: PortfolioShares) => {
  console.log(rawData);
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
  const { data, isLoading } = useGetPortfolioShares();
  const { header, rows: mappedData } = useMemo(() => mapData(data), [data]);

  return (
    <>
      <Typography variant="h1">Portfolio Diff</Typography>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <DataTable
            className="mb-4"
            columns={TableColumns(header, mappedData)}
            data={mappedData}
            columnPinning={{ left: ['portfolio'], right: ['total'] }}
          />
        </>
      )}
    </>
  );
};

export default Diff;
