import { forwardRef } from 'react';
import ActualForm from '../TransferForm';

import type { TransferFromProps } from '../TransferForm';

const TransferForm = forwardRef((props: TransferFromProps, ref) => {
  return <ActualForm {...props} ref={ref} />;
});

export default TransferForm;
