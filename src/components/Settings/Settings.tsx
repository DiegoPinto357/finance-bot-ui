import { useQuery } from 'react-query';
import Typography from '../lib/Typography';
import systemService from '../../services/system';

const Settings = () => {
  const { data, isLoading, isSuccess } = useQuery(
    'serverVersion',
    () => systemService.getServerVersion(),
    {
      staleTime: 0,
      cacheTime: 0,
    }
  );

  const serverVersion = isLoading
    ? 'Loading'
    : !isSuccess
    ? 'Offline'
    : data?.version;

  return (
    <>
      <Typography variant="h1">Settings</Typography>
      <div className="my-8">
        <Typography variant="h2">Status</Typography>
        <p>App version: {APP_VERSION}</p>
        <p>Server version: {serverVersion}</p>
      </div>

      <div className="my-8">
        <Typography variant="h2">Configs</Typography>
        Server host:
      </div>

      <div className="my-8">
        <Typography variant="h2">Actions</Typography>
        Update tables Clear cache
      </div>

      <div className="my-8">
        <Typography variant="h2">Debug</Typography>
        Dryrun mode Data cache config
      </div>
    </>
  );
};

export default Settings;
