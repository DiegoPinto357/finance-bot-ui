import { useQuery } from 'react-query';
import portfolioService from '../../../services/portfolio';

const useGetPortfolioLiquidity = () =>
  useQuery('portfolioHistory', () => portfolioService.getLiquidity());

export default useGetPortfolioLiquidity;
