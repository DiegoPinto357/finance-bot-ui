import Typography from './lib/Typography';
import Home from './Home';
import Stock from './modules/Stock';
import CryptoHodl from './modules/Crypto/Hodl';
import CryptoBacked from './modules/Crypto/Backed';
import CryptoDefi from './modules/Crypto/Defi';
import PortfolioPosition from './modules/Portfolio/Position';
import PortfolioDiff from './modules/Portfolio/Diff';
import Settings from './Settings';

export type Route = {
  path: string;
  label: string;
  component: () => JSX.Element;
};

// eslint-disable-next-line react-refresh/only-export-components
const NotFound = () => <Typography variant="h1">Not found</Typography>;

export const routes: Record<string, Route[]> = {
  general: [
    {
      path: '/',
      label: 'Home',
      component: Home,
    },
    {
      path: '/settings',
      label: 'Settings',
      component: Settings,
    },
    {
      path: '/about',
      label: 'About',
      component: NotFound,
    },
    {
      path: '/contact',
      label: 'Contact',
      component: NotFound,
    },
  ],
  stock: [
    {
      path: '/stock/br',
      label: 'BR',
      component: () => <Stock assetType="br" />,
    },
    {
      path: '/stock/us',
      label: 'US',
      component: () => <Stock assetType="us" />,
    },
    {
      path: '/stock/fii',
      label: 'FII',
      component: () => <Stock assetType="fii" />,
    },
  ],
  crypto: [
    {
      path: '/crypto/hodl',
      label: 'HODL',
      component: CryptoHodl,
    },
    {
      path: '/crypto/backed',
      label: 'Backed',
      component: CryptoBacked,
    },
    {
      path: '/crypto/defi',
      label: 'DeFi',
      component: CryptoDefi,
    },
    {
      path: '/crypto/defi2',
      label: 'DeFi2',
      component: NotFound,
    },
  ],
  portfolio: [
    {
      path: '/portfolio/position',
      label: 'Position',
      component: PortfolioPosition,
    },
    {
      path: '/portfolio/diff',
      label: 'Diff',
      component: PortfolioDiff,
    },
    {
      path: '/portfolio/liquidity',
      label: 'Liquidity',
      component: NotFound,
    },
  ],
};
