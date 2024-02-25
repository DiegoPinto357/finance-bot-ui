import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockedOnFormSubmit } from './__mocks__/TransferForm';
import OperationDialog from './OperationDialog';

vi.mock('../Fixed/useGetFixedBalance');
vi.mock('./TransferForm');

const confirm = async (action: 'Yes' | 'No') => {
  const confirmDialog = screen.getByRole('alertdialog', { name: 'Confirm?' });
  const confirmButton = within(confirmDialog).getByRole('button', {
    name: action,
  });
  await userEvent.click(confirmButton);

  expect(confirmDialog).not.toBeVisible();
};

describe('OperationDialog', () => {
  const operationData = {
    portfolio: 'suricat',
    originAsset: 'iti',
    destinyAsset: 'nubank',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('submits form if user confirms it on confirm dialog', async () => {
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
    expect(mockedOnFormSubmit).toBeCalledTimes(1);
  });

  it('does not submit form if user do not confirm it on confirm dialog', async () => {
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
    expect(mockedOnFormSubmit).not.toBeCalled();
  });

  it('renders error message if server fails', async () => {
    const errorMessage = 'Error message!';
    mockedOnFormSubmit.mockRejectedValueOnce(new Error(errorMessage));

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
