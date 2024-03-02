import axios, { RawAxiosRequestConfig } from 'axios';

const POST_DRYRUN = true;

const host = 'http://localhost:3001';
// const host = 'http://192.168.1.200:3001';

const httpClient = axios.create({
  baseURL: host,
  timeout: 15000,
});

const get = async <T>(url: string, config?: RawAxiosRequestConfig<unknown>) => {
  const response = await httpClient(url, config);
  return response.data as T;
};

const post = async <T>(
  url: string,
  data: object,
  config?: RawAxiosRequestConfig<unknown>
) => {
  const response = await httpClient<T>(url, {
    ...config,
    method: 'POST',
    data: POST_DRYRUN ? { ...data, dryRun: true } : data,
  });
  return response.data;
};

export default {
  get,
  post,
};
