import {
  NavigationMenu,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import MenuItem from './MenuItem';
import SubMenu from './SubMenu';

// TODO create centralized source of routes to feed both menu and router
const stockSubmenuItems = [
  { label: 'BR', path: '/stock/br' },
  { label: 'US', path: '/stock/us' },
  { label: 'FII', path: '/stock/fii' },
];

const cryptoSubmenuItems = [
  { label: 'HODL', path: '/crypto/hodl' },
  { label: 'DeFi', path: '/crypto/defi' },
  { label: 'DeFi2', path: '/crypto/defi2' },
  { label: 'Backed', path: '/crypto/backed' },
];

const NavigationBar = () => {
  return (
    <NavigationMenu className="p-4">
      <NavigationMenuList>
        <MenuItem path="/">Home</MenuItem>
        <SubMenu items={stockSubmenuItems}>Stock</SubMenu>
        <SubMenu items={cryptoSubmenuItems}>Crypto</SubMenu>
        <MenuItem path="/portfolio">Portfolio</MenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavigationBar;
