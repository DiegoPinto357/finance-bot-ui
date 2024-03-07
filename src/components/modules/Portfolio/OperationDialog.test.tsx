import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockedOnFormSubmit } from './__mocks__/TransferForm';
import OperationDialog from './OperationDialog';
import portfolios from '../../../../mockData/api/portfolio/portfolios';

vi.mock('../Fixed/useGetFixedBalance');
vi.mock('./TransferForm');
vi.mock('./SwapForm');

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

  it('renders corresponding form when clicking on tabs', async () => {
    render(
      <OperationDialog
        open
        operations={['transfer', 'swap']}
        operationData={operationData}
        portfolios={portfolios}
        onOpenChange={() => {}}
      />
    );

    const transferTab = screen.getByRole('tab', { name: 'transfer' });
    const swapTab = screen.getByRole('tab', { name: 'swap' });

    let transferForm = screen.getByRole('form', { name: 'transfer' });
    expect(transferForm).toBeInTheDocument();

    await userEvent.click(swapTab);
    const swapForm = screen.getByRole('form', { name: 'swap' });
    expect(swapForm).toBeInTheDocument();

    await userEvent.click(transferTab);
    transferForm = screen.getByRole('form', { name: 'transfer' });
    expect(transferForm).toBeInTheDocument();
  });

  it('submits form if user confirms it on confirm dialog', async () => {
    render(
      <OperationDialog
        open
        operations={['transfer', 'swap']}
        operationData={operationData}
        portfolios={portfolios}
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
        portfolios={portfolios}
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
        portfolios={portfolios}
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
