import { useState, useEffect } from 'react';
import Hodl from './modules/crypto/Hodl';
import cryptoService from './services/crypto';

import type { CryptoHodlBalanceItem } from './modules/crypto/Hodl/TableColumns';

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
      <Hodl data={data} />
    </div>
  );
};

export default App;
