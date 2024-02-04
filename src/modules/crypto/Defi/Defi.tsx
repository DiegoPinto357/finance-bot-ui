import { useQuery } from 'react-query';
import cryptoService from '../../../services/crypto';

const Defi = () => {
  // TODO use loading and error flags
  const { data } = useQuery('cryptoDefi', () =>
    cryptoService.getBalance('defi')
  );

  return (
    <>
      {/* TODO create typography */}
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 lg:mb-8">
        Crypto DeFi
      </h1>
      {/* <DataTable columns={TableColumns} data={data?.balance} /> */}
      {JSON.stringify(data, null, 2)}
    </>
  );
};

export default Defi;
