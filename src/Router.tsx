import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import CryptoHodl from './modules/crypto/Hodl';

const Router = () => {
  return (
    <Routes>
      <Route path="/" Component={Home} />
      <Route path="/crypto/hodl" Component={CryptoHodl} />
      <Route path="/portfolio" element={<h1>Portfolio</h1>} />
      <Route path="*" element={<h1>Not found</h1>} />
    </Routes>
  );
};

export default Router;
