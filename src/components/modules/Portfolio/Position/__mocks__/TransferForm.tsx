import { forwardRef } from 'react';
import ActualForm from '../Position/TransferForm';

import type { TransferFromProps } from '../Position/TransferForm';

const TransferForm = forwardRef((props: TransferFromProps, ref) => {
  return <ActualForm {...props} ref={ref} />;
});

export default TransferForm;
