import { Routes, Route } from 'react-router-dom';
import Typography from './lib/Typography';
import Home from './Home';
import CryptoHodl from './modules/crypto/Hodl';
import CryptoDefi from './modules/crypto/Defi';
import Portfolio from './modules/Portfolio';

const Router = () => {
  return (
    <Routes>
      <Route path="/" Component={Home} />

      <Route path="/crypto/hodl" Component={CryptoHodl} />
      <Route path="/crypto/defi" Component={CryptoDefi} />

      <Route path="/portfolio" Component={Portfolio} />

      <Route
        path="*"
        element={<Typography variant="h1">Not found</Typography>}
      />
    </Routes>
  );
};

export default Router;
