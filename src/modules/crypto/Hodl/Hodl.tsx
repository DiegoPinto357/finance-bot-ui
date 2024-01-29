import DataTable from '../../../DataTable';
import { TableColumns } from './TableColumns';

import type { CryptoHodlBalanceItem } from './TableColumns';

type Props = {
  data: CryptoHodlBalanceItem[];
};

const Hodl = ({ data }: Props) => {
  return (
    <>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 lg:mb-8">
        Crypto HODL
      </h1>
      <DataTable columns={TableColumns} data={data} />;
    </>
  );
};

export default Hodl;
