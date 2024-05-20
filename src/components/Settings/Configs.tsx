import { useState } from 'react';
import { RadioGroup } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Typography from '../lib/Typography';
import RadioItem from '../lib/RadioItem';

import type { ComponentPropsWithoutRef } from 'react';

const Configs = ({ className }: ComponentPropsWithoutRef<'div'>) => {
  const [serverHost, setServerHost] = useState<string>('localhost');
  const isCustomServerHost = serverHost === 'custom';

  return (
    <div className={className}>
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
  );
};

export default Configs;
