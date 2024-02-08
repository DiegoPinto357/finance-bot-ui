import { useQuery } from 'react-query';
import portfolioService from '../../../services/portfolio';

const useGetportfolioBalance = () =>
  useQuery('portfolioBalance', () => portfolioService.getBalance());

export default useGetportfolioBalance;
