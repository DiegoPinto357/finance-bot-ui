import { useQuery } from 'react-query';
import portfolioService from '../../../services/portfolio';

const useGetPortfolioShares = () =>
  useQuery('portfolioShares', () => portfolioService.getShares());

export default useGetPortfolioShares;
