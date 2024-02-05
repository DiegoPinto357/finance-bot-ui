import { useQuery } from 'react-query';
import Typography from '@/components/Typography';
import cryptoService from '../../../../services/crypto';

const Defi = () => {
  // TODO use loading and error flags
  const { data } = useQuery('cryptoDefiBalance', () =>
    cryptoService.getBalance('defi')
  );

  return (
    <>
      <Typography variant="h1">Crypto DeFi</Typography>
      {/* <DataTable columns={TableColumns} data={data?.balance} /> */}
      {JSON.stringify(data, null, 2)}
    </>
  );
};

export default Defi;
