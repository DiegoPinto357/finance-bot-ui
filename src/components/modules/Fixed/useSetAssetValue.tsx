import { useMutation } from 'react-query';
import fixedService from '../../../services/fixed';

const useSetAssetValue = () => {
  const { mutateAsync, ...rest } = useMutation(fixedService.setAssetValue);
  return { setAssetValue: mutateAsync, ...rest };
};

export default useSetAssetValue;
