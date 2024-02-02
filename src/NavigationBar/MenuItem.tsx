import { PropsWithChildren } from 'react';
import {
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

type Props = {
  path: string;
};

const MenuItem = ({ path, children }: PropsWithChildren<Props>) => (
  <NavigationMenuItem>
    <NavigationMenuLink className={navigationMenuTriggerStyle()} href={path}>
      {children}
    </NavigationMenuLink>
  </NavigationMenuItem>
);

export default MenuItem;
