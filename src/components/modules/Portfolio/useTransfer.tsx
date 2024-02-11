import { useMutation } from 'react-query';
import portfolioService from '../../../services/portfolio';

const useTransfer = () => {
  const { mutateAsync, ...rest } = useMutation(portfolioService.transfer);
  return { transfer: mutateAsync, ...rest };
};

export default useTransfer;
