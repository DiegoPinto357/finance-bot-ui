import { forwardRef } from 'react';
import GenericForm from './GenericForm';

// eslint-disable-next-line react-refresh/only-export-components
export { mockedOnFormSubmit } from './GenericForm';

const SwapForm = forwardRef(
  (
    props: { onSubmmit: () => void; onError: (errorMessage: string) => void },
    ref
  ) => {
    return <GenericForm {...props} ariaLabel="swap" ref={ref} />;
  }
);

export default SwapForm;
