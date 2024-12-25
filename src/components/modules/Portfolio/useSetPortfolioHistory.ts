import { useMutation } from 'react-query';
import portfolioService from '../../../services/portfolio';

const useSetPortfolioHistory = () => {
  const { mutateAsync, ...rest } = useMutation(portfolioService.setHistory);
  return { setPortfolioHistory: mutateAsync, ...rest };
};

export default useSetPortfolioHistory;
