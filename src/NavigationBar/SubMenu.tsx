import { PropsWithChildren } from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import SubMenuItem from './SubMenuItem';

type Props = {
  items: { label: string; path: string }[];
};

const SubMenu = ({ items, children }: PropsWithChildren<Props>) => (
  <NavigationMenuItem>
    <NavigationMenu>
      <NavigationMenuTrigger>{children}</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="w-fit min-w-[90px] gap-3 p-2">
          {items.map(({ label, path }) => (
            <SubMenuItem to={path}>{label}</SubMenuItem>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenu>
  </NavigationMenuItem>
);

export default SubMenu;
