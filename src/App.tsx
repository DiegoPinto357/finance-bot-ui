import { useState, useEffect } from 'react';
import HodlTable from './modules/crypto/HodlTable';
import { Columns } from './modules/crypto/HodlTable/Columns';

import type { CryptoHodlBalanceItem } from './modules/crypto/HodlTable/Columns';

import { hodl } from '../mockData/api/crypto/balance';

const getData = async (): Promise<CryptoHodlBalanceItem[]> => {
  return hodl.balance;
};

const App = () => {
  const [data, setData] = useState<CryptoHodlBalanceItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const newData = await getData();
      setData(newData);
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 lg:mb-8">
        Crypto HODL
      </h1>
      <HodlTable columns={Columns} data={data} />
    </div>
  );
};

export default App;
