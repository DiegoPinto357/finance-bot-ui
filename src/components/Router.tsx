import { Routes, Route } from 'react-router-dom';
import Typography from './Typography';
import Home from './Home';
import CryptoHodl from './modules/crypto/Hodl';
import CryptoDefi from './modules/crypto/Defi';

const Router = () => {
  return (
    <Routes>
      <Route path="/" Component={Home} />

      <Route path="/crypto/hodl" Component={CryptoHodl} />
      <Route path="/crypto/defi" Component={CryptoDefi} />

      <Route path="/portfolio" element={<h1>Portfolio</h1>} />

      <Route
        path="*"
        element={<Typography variant="h1">Not found</Typography>}
      />
    </Routes>
  );
};

export default Router;
