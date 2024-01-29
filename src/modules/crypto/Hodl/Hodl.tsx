import { useState, useEffect } from 'react';
import DataTable from '../../../DataTable';
import { TableColumns } from './TableColumns';
import cryptoService from '../../../services/crypto';

import type { CryptoHodlBalanceItem } from './TableColumns';

const Hodl = () => {
  const [data, setData] = useState<CryptoHodlBalanceItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { balance } = await cryptoService.getBalance('hodl');
      setData(balance);
    };

    fetchData();
  }, []);

  return (
    <>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 lg:mb-8">
        Crypto HODL
      </h1>
      <DataTable columns={TableColumns} data={data} />
    </>
  );
};

export default Hodl;
