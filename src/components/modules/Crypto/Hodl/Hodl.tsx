import Typography from '@/components/lib/Typography';
import Loader from '@/components/lib/Loader';
import DataTable from '@/components/DataTable';
import { useGetCryptoBalance } from '../getCryptoBalance';
import { formatCurrency } from '@/lib/formatNumber';
import { TableColumns } from './TableColumns';

const Hodl = () => {
  const { data, isLoading } = useGetCryptoBalance('hodl');

  return (
    <>
      <Typography variant="h1">Crypto HODL</Typography>
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
