import { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
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
    <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
      <Link to={path}>{children}</Link>
    </NavigationMenuLink>
  </NavigationMenuItem>
);

export default MenuItem;
