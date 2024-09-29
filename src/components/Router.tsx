import { Routes, Route } from 'react-router-dom';
import Typography from './lib/Typography';
import Home from './Home';
import CryptoHodl from './modules/Crypto/Hodl';
import CryptoDefi from './modules/Crypto/Defi';
import Portfolio from './modules/Portfolio';
import Settings from './Settings';

const Router = () => {
  return (
    <Routes>
      <Route path="/" Component={Home} />

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
