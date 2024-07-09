import { useMutation } from 'react-query';
import fixedService from '../../../services/fixed';

export const useSetFixedAssetValue = () => {
  const { mutateAsync, ...rest } = useMutation(fixedService.setAssetValue);
  return { setFixedAssetValue: mutateAsync, ...rest };
};
