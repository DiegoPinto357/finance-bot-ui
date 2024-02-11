import { PulseLoader } from 'react-spinners';

const Loader = () => (
  <PulseLoader
    className="loader text-center my-32"
    cssOverride={{ display: 'block' }}
  />
);

export default Loader;
