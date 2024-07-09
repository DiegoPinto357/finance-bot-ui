import { useMutation } from 'react-query';
import stockService from '../../../services/stock';

export const useSetStockAssetValue = () => {
  const { mutateAsync, ...rest } = useMutation(stockService.setAssetValue);
  return { setStockAssetValue: mutateAsync, ...rest };
};
