import { Routes, Route } from 'react-router-dom';
import Typography from './lib/Typography';
import Home from './Home';
import Stock from './modules/Stock';
import CryptoHodl from './modules/Crypto/Hodl';
import CryptoDefi from './modules/Crypto/Defi';
import Portfolio from './modules/Portfolio';
import Settings from './Settings';

const Router = () => {
  return (
    <Routes>
      <Route path="/" Component={Home} />

      <Route path="/stock/br" element={<Stock assetType="br" />} />
      <Route path="/stock/us" element={<Stock assetType="us" />} />
      <Route path="/stock/fii" element={<Stock assetType="fii" />} />

      <Route path="/crypto/hodl" Component={CryptoHodl} />
      <Route path="/crypto/defi" Component={CryptoDefi} />

      <Route path="/portfolio" Component={Portfolio} />

      <Route path="/settings" Component={Settings} />

      <Route
        path="*"
        element={<Typography variant="h1">Not found</Typography>}
      />
    </Routes>
  );
};

export default Router;
