import httpClient from '@/lib/httpClient';

type ServerVersion = {
  version: string;
};

const getServerVersion = () =>
  httpClient.get<ServerVersion>('/api/system/version');

export default {
  getServerVersion,
};
