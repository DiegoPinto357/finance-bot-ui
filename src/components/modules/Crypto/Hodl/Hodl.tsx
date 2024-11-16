import PageHeading from '@/components/lib/PageHeading';
import Typography from '@/components/lib/Typography';
import Loader from '@/components/lib/Loader';
import DataTable from '@/components/DataTable';
import { useGetCryptoBalance } from '../getCryptoBalance';
import { formatCurrency } from '@/lib/formatNumber';
import { TableColumns } from './TableColumns';

const Hodl = () => {
  const { data, isLoading, isFetching, refetch } = useGetCryptoBalance('hodl');

  return (
    <>
      <PageHeading isRefreshing={isFetching} onRefreshClick={() => refetch()}>
        Crypto HODL
      </PageHeading>
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

export default Hodl;
