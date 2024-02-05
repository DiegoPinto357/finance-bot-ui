import { useQuery } from 'react-query';
import Typography from '@/components/Typography';
import DataTable from '@/components/DataTable';
import { formatCurrency } from '@/lib/formatNumber';
import { TableColumns } from './TableColumns';
import cryptoService from '../../../../services/crypto';

const Hodl = () => {
  // TODO use loading and error flags
  const { data } = useQuery('cryptoHodlBalance', () =>
    cryptoService.getBalance('hodl')
  );

  return (
    <>
      <Typography variant="h1">Crypto HODL</Typography>
      <DataTable className="mb-4" columns={TableColumns} data={data?.balance} />
      <Typography variant="h3">Total: {formatCurrency(data?.total)}</Typography>
    </>
  );
};

export default Hodl;
