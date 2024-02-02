import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <Link to="/crypto/hodl">Crypto HODL</Link>
      <br />
      <Link to="/portfolio">Portfolio</Link>
    </div>
  );
};

export default Home;
