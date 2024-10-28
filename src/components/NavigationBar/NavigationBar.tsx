import {
  NavigationMenu,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import MenuItem from './MenuItem';
import SubMenu from './SubMenu';
import { routes } from '../routes';

const NavigationBar = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <MenuItem path="/">Home</MenuItem>
        <SubMenu items={routes.stock}>Stock</SubMenu>
        <SubMenu items={routes.crypto}>Crypto</SubMenu>
        <SubMenu items={routes.portfolio}>Portfolio</SubMenu>
        <MenuItem path="/settings">Settings</MenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavigationBar;
