import { useState, useEffect } from 'react';
import HodlTable from './DataTable';
import { Columns } from './modules/crypto/HodlTable/Columns';
import cryptoService from './services/crypto';

import type { CryptoHodlBalanceItem } from './modules/crypto/HodlTable/Columns';

const App = () => {
  const [data, setData] = useState<CryptoHodlBalanceItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { balance } = await cryptoService.getBalance('hodl');
      setData(balance);
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
