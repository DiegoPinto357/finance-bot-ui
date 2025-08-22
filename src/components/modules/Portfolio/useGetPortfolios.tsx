import { useQuery } from 'react-query';
import portfolioService from '@/services/portfolio';

const useGetPortfolios = () =>
  useQuery('portfolioList', () => portfolioService.getList());

export default useGetPortfolios;
