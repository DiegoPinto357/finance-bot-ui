import { useState, useEffect } from 'react';
import httpClient from '@/lib/httpClient';
import { SERVER_HOST_ADDRESS } from './Settings/constants';

const useConfigs = () => {
  const [serverHostState, setServerHostState] = useState<string>('localhost');
  const [customServerHostState, setCustomServerHostState] =
    useState<string>('');

  useEffect(() => {
    const storageServerHost = localStorage.getItem('serverHost');
    const storageCustomServerHost = localStorage.getItem('customServerHost');
    const serverHost = storageServerHost || 'localhost';
    const customServerHost = storageCustomServerHost || '';
    setServerHostState(serverHost);
    setCustomServerHostState(customServerHost);

    if (serverHost === 'custom') {
      httpClient.config({ host: customServerHost });
    } else {
      httpClient.config({ host: SERVER_HOST_ADDRESS[serverHost] });
    }
  }, []);

  const setServerHost = (host: string) => {
    setServerHostState(host);

    if (host === 'custom') {
      httpClient.config({ host: customServerHostState });
    } else {
      httpClient.config({ host: SERVER_HOST_ADDRESS[host] });
    }

    localStorage.setItem('serverHost', host);
  };

  const setCustomServerHost = (address: string) => {
    setCustomServerHostState(address);
    httpClient.config({ host: address });
    localStorage.setItem('customServerHost', address);
  };

  return {
    serverHost: serverHostState,
    customServerHost: customServerHostState,
    setServerHost,
    setCustomServerHost,
  };
};

export default useConfigs;
