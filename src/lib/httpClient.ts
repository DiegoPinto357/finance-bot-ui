import axios, { RawAxiosRequestConfig } from 'axios';

const POST_DRYRUN = false;

if (POST_DRYRUN) {
  console.log('Post dryrun mode enabled!');
}

const defaultHost = 'http://localhost:3001';

const httpClient = axios.create({
  baseURL: defaultHost,
  timeout: 15000,
});

httpClient.interceptors.request.use(config => {
  if (POST_DRYRUN && config.method === 'POST') {
    config.data = { ...config.data, dryRun: true };
  }
  return config;
});

let resolveIsReady: () => void;
const isReady = new Promise<void>(resolve => {
  resolveIsReady = resolve;
});

type Config = {
  host?: string;
};

const config = ({ host }: Config) => {
  if (host) httpClient.defaults.baseURL = host;
  resolveIsReady();
};

const get = async <T>(url: string, config?: RawAxiosRequestConfig<unknown>) => {
  await isReady;
  const response = await httpClient(url, config);
  return response.data as T;
};

const post = async <T>(
  url: string,
  data: object = {},
  config?: RawAxiosRequestConfig<unknown>
) => {
  await isReady;
  const response = await httpClient<T>(url, {
    ...config,
    method: 'POST',
    data,
  });
  return response.data;
};

export default {
  config,
  get,
  post,
};
