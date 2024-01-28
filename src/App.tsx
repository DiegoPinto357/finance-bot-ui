import { useState, useEffect } from 'react';
import HodlTable from './modules/crypto/HodlTable';
import { columns } from './modules/crypto/HodlTable/columns';

import type { Payment } from './modules/crypto/HodlTable/columns';

const getData = async (): Promise<Payment[]> => {
  // Fetch data from your API here.
  return [
    {
      id: 'm5gr84i9',
      amount: 316,
      status: 'success',
      email: 'ken99@yahoo.com',
    },
    {
      id: '3u1reuv4',
      amount: 242,
      status: 'success',
      email: 'Abe45@gmail.com',
    },
    {
      id: 'derv1ws0',
      amount: 837,
      status: 'processing',
      email: 'Monserrat44@gmail.com',
    },
    {
      id: '5kma53ae',
      amount: 874,
      status: 'success',
      email: 'Silas22@gmail.com',
    },
    {
      id: 'bhqecj4p',
      amount: 721,
      status: 'failed',
      email: 'carmella@hotmail.com',
    },
  ];
};

const App = () => {
  const [data, setData] = useState<Payment[]>([]);

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
      <HodlTable columns={columns} data={data} />
    </div>
  );
};

export default App;
