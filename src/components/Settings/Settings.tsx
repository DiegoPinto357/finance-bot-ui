import { useState } from 'react';
import { useQuery } from 'react-query';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Typography from '../lib/Typography';
import systemService from '../../services/system';

type RadioItemProps = {
  id: string;
  value: string;
  label: string;
};

const RadioItem = ({ id, value, label }: RadioItemProps) => {
  return (
    <div className="flex items-center space-x-2">
      <RadioGroupItem value={value} id={id} />
      <Label htmlFor={id}>{label}</Label>
    </div>
  );
};

const Settings = () => {
  const [serverHost, setServerHost] = useState<string>('localhost');

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

  const isCustomServerHost = serverHost === 'custom';

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
        <Typography variant="h3">Server host:</Typography>
        <RadioGroup defaultValue="localhost" onValueChange={setServerHost}>
          <RadioItem
            id="server-host-localhost"
            value="localhost"
            label="Local host (http://localhost:3001)"
          />
          <RadioItem
            id="server-host-homeserver"
            value="homeserver"
            label="Home server (http://192.168.31.200:3001)"
          />
          <RadioItem
            id="server-host-custom"
            value="custom"
            label="Custom address"
          />
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input disabled={!isCustomServerHost} placeholder="http://" />
            <Button disabled={!isCustomServerHost}>Ok</Button>
          </div>
        </RadioGroup>
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
