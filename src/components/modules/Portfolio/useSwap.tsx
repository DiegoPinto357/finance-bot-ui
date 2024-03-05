import { useMutation } from 'react-query';
import portfolioService from '../../../services/portfolio';

const useSwap = () => {
  const { mutateAsync, ...rest } = useMutation(portfolioService.swap);
  return { swap: mutateAsync, ...rest };
};

export default useSwap;
