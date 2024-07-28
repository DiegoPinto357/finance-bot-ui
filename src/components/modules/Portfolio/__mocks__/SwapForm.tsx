import { forwardRef } from 'react';
import ActualForm from '../SwapForm';

import type { SwapFormProps } from '../SwapForm';

const SwapForm = forwardRef((props: SwapFormProps, ref) => {
  return <ActualForm {...props} ref={ref} />;
});

export default SwapForm;
