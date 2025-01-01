import { useQuery } from 'react-query';
import portfolioService from '../../../services/portfolio';

const useGetPortfolioLiquidity = () =>
  useQuery('portfolioLiquidity', () => portfolioService.getLiquidity());

export default useGetPortfolioLiquidity;
