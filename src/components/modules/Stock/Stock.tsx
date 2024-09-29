import Typography from '@/components/lib/Typography';
import Loader from '@/components/lib/Loader';
import DataTable from '@/components/DataTable';
import { useGetStockBalance } from './getStockBalance';
import { formatCurrency } from '@/lib/formatNumber';
import { TableColumns } from './TableColumns';

import type { StockAssetType } from '@/types';

type Props = {
  assetType: StockAssetType;
};

const Stock = ({ assetType }: Props) => {
  const { data, isLoading } = useGetStockBalance(assetType);

  return (
    <>
      <Typography variant="h1">{`Stock ${assetType.toUpperCase()}`}</Typography>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <DataTable
            className="mb-4"
            columns={TableColumns}
            data={data?.balance}
          />
          <Typography variant="h3">
            Total: {formatCurrency(data?.total)}
          </Typography>
        </>
      )}
    </>
  );
};

export default Stock;
