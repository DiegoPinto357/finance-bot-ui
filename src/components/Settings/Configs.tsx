import { useRef } from 'react';
import { useQueryClient } from 'react-query';
import { RadioGroup } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useConfigs from '../useConfigs';
import Typography from '../lib/Typography';
import RadioItem from '../lib/RadioItem';
import { SERVER_HOST_ADDRESS } from './constants';

import type { ComponentPropsWithoutRef } from 'react';

const Configs = ({ className }: ComponentPropsWithoutRef<'div'>) => {
  const { serverHost, customServerHost, setServerHost, setCustomServerHost } =
    useConfigs();

  const customServerHostInput = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

  const handleServerHostChange = (value: string) => {
    setServerHost(value);
    queryClient.refetchQueries({
      queryKey: 'serverVersion',
      exact: true,
    });
  };

  const handleCustomSeverHostButtonClick = () => {
    setCustomServerHost(customServerHostInput.current?.value || '');
    queryClient.refetchQueries({
      queryKey: 'serverVersion',
      exact: true,
    });
  };

  const isCustomServerHost = serverHost === 'custom';

  return (
    <div className={className}>
      <Typography variant="h2">Configs</Typography>
      <Typography id="server-host-label" variant="h3">
        Server host
      </Typography>
      <RadioGroup
        value={serverHost}
        onValueChange={handleServerHostChange}
        aria-labelledby="server-host-label"
      >
        <RadioItem
          id="server-host-localhost"
          value="localhost"
          label={`Local host (${SERVER_HOST_ADDRESS.localhost})`}
        />
        <RadioItem
          id="server-host-homeserver"
          value="homeserver"
          label={`Home server (${SERVER_HOST_ADDRESS.homeserver})`}
        />
        <RadioItem
          id="server-host-custom"
          value="custom"
          label="Custom address"
        />
        <div className="flex w-full max-w-sm items-center space-x-2">
          {/* TODO handle enter press */}
          <Input
            ref={customServerHostInput}
            disabled={!isCustomServerHost}
            placeholder="http://"
            defaultValue={customServerHost}
            aria-labelledby="server-host-custom"
          />
          <Button
            disabled={!isCustomServerHost}
            onClick={handleCustomSeverHostButtonClick}
          >
            Ok
          </Button>
        </div>
      </RadioGroup>
    </div>
  );
};

export default Configs;
