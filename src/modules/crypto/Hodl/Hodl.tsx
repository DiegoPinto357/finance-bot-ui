import { useQuery } from 'react-query';
import DataTable from '../../../DataTable';
import { TableColumns } from './TableColumns';
import cryptoService from '../../../services/crypto';

const Hodl = () => {
  // TODO use loading and error flags
  const { data } = useQuery('cryptoHodl', () =>
    cryptoService.getBalance('hodl')
  );

  return (
    <>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 lg:mb-8">
        Crypto HODL
      </h1>
      <DataTable columns={TableColumns} data={data?.balance} />
    </>
  );
};

export default Hodl;
