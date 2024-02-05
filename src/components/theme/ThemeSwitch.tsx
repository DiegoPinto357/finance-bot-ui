import { useCallback } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useTheme } from './useTheme';

type Props = {
  className: string;
};

const ThemeSwitch = ({ className }: Props) => {
  const { theme, setTheme } = useTheme();

  const handleOnChange = useCallback(
    (checked: boolean) => {
      if (checked) {
        setTheme('dark');
      } else {
        setTheme('light');
      }
    },
    [setTheme]
  );

  return (
    <div className={`flex my-auto ${className}`}>
      <Sun className="h-[1.2rem] w-[1.2rem] mx-2" />
      <Switch checked={theme === 'dark'} onCheckedChange={handleOnChange} />
      <Moon className="h-[1.2rem] w-[1.2rem] mx-2" />
    </div>
  );
};

export default ThemeSwitch;
