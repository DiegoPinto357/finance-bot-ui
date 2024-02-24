import { forwardRef, useImperativeHandle } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import OperationDialog from './OperationDialog';

const onFormSubmit = vi.fn();

vi.mock('./TransferForm', () => ({
  default: forwardRef(
    (
      {
        onSubmmit,
        onError,
      }: { onSubmmit: () => void; onError: (errorMessage: string) => void },
      ref
    ) => {
      const form = useForm();

      useImperativeHandle(ref, () => ({
        validate: () => form.trigger(),
      }));

      const handleSubmit = async () => {
        try {
          onSubmmit();
          await onFormSubmit();
        } catch (error) {
          if (error instanceof Error) onError(error.message);
          else onError(String(error));
        }
      };

      return (
        <Form {...form}>
          <form
            id="operation-form"
            aria-label="operation-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid grid-cols-2 gap-4"
            noValidate
          ></form>
        </Form>
      );
    }
  ),
}));

const confirm = async (action: 'Yes' | 'No') => {
  const confirmDialog = screen.getByRole('alertdialog', { name: 'Confirm?' });
  const confirmButton = within(confirmDialog).getByRole('button', {
    name: action,
  });
  await userEvent.click(confirmButton);

  expect(confirmDialog).not.toBeVisible();
};

describe('OperationDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('submits form if user confirms it on confirm dialog', async () => {
    const operationData = {
      portfolio: 'suricat',
      origin: 'iti',
      destiny: 'nubank',
    };

    render(
      <OperationDialog
        open
        operations={['transfer', 'swap']}
        operationData={operationData}
        onOpenChange={() => {}}
      />
    );

    const submitButton = screen.getByRole('button', {
      name: 'Submit',
    });
    await userEvent.click(submitButton);

    await confirm('Yes');
    expect(onFormSubmit).toBeCalledTimes(1);
  });

  it('does not submit form if user do not confirm it on confirm dialog', async () => {
    const operationData = {
      portfolio: 'suricat',
      origin: 'iti',
      destiny: 'nubank',
    };

    render(
      <OperationDialog
        open
        operations={['transfer', 'swap']}
        operationData={operationData}
        onOpenChange={() => {}}
      />
    );

    const submitButton = screen.getByRole('button', {
      name: 'Submit',
    });
    await userEvent.click(submitButton);

    await confirm('No');
    expect(onFormSubmit).not.toBeCalled();
  });

  it('renders error message if server fails', async () => {
    const errorMessage = 'Error message!';
    onFormSubmit.mockRejectedValueOnce(new Error(errorMessage));

    const operationData = {
      portfolio: 'suricat',
      origin: 'iti',
      destiny: 'nubank',
    };

    render(
      <OperationDialog
        open
        operations={['transfer', 'swap']}
        operationData={operationData}
        onOpenChange={() => {}}
      />
    );

    const submitButton = screen.getByRole('button', {
      name: 'Submit',
    });
    await userEvent.click(submitButton);
    await confirm('Yes');

    const errorMessageElement = screen.getByText(errorMessage);
    expect(errorMessageElement).toBeInTheDocument();
  });
});
