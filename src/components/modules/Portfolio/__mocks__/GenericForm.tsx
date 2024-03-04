import { forwardRef, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';

// eslint-disable-next-line react-refresh/only-export-components
export const mockedOnFormSubmit = vi.fn();

const TransferForm = forwardRef(
  (
    {
      ariaLabel,
      onSubmmit,
      onError,
    }: {
      ariaLabel: string;
      onSubmmit: () => void;
      onError: (errorMessage: string) => void;
    },
    ref
  ) => {
    const form = useForm();

    useImperativeHandle(ref, () => ({
      validate: () => form.trigger(),
    }));

    const handleSubmit = async () => {
      try {
        onSubmmit();
        await mockedOnFormSubmit();
      } catch (error) {
        if (error instanceof Error) onError(error.message);
        else onError(String(error));
      }
    };

    return (
      <Form {...form}>
        <form
          id="operation-form"
          aria-label={ariaLabel}
          onSubmit={form.handleSubmit(handleSubmit)}
          className="grid grid-cols-2 gap-4"
          noValidate
        ></form>
      </Form>
    );
  }
);

export default TransferForm;
