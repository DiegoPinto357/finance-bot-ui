import { useQuery } from 'react-query';
import portfolioService from '../../../services/portfolio';

const options = {
  staleTime: 12 * 60 * (60 * 1000),
  cacheTime: 12 * 60 * (60 * 1000),
};

const useGetPortfolioHistory = () =>
  useQuery('portfolioHistory', () => portfolioService.getHistory(), options);

export default useGetPortfolioHistory;
