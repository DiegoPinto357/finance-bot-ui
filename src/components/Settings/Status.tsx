import { useQuery } from 'react-query';
import Typography from '../lib/Typography';
import systemService from '../../services/system';

import type { ComponentPropsWithoutRef } from 'react';

const Status = ({ className }: ComponentPropsWithoutRef<'div'>) => {
  const { data, isFetching, isSuccess } = useQuery(
    'serverVersion',
    () => systemService.getServerVersion(),
    {
      staleTime: 0,
      cacheTime: 0,
    }
  );

  const serverVersion = isFetching
    ? 'Loading'
    : !isSuccess
    ? 'Offline'
    : data?.version;

  return (
    <div className={className}>
      <Typography variant="h2">Status</Typography>
      <p>App version: {APP_VERSION}</p>
      <p>Server version: {serverVersion}</p>
    </div>
  );
};

export default Status;
