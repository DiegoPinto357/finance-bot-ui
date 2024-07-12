import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockedOnFormSubmit } from './__mocks__/TransferForm';
import OperationDialog from './OperationDialog';
import portfolios from '../../../../mockData/api/portfolio/portfolios';

vi.mock('../Fixed/getFixedBalance');
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
    originAsset: { class: 'fixed', name: 'iti' },
    destinyAsset: { class: 'fixed', name: 'nubank' },
  } as const;

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

    const transferTab = screen.getByRole('tab', { name: 'Transfer' });
    const swapTab = screen.getByRole('tab', { name: 'Swap' });

    let transferForm = screen.getByRole('form', { name: 'transfer' });
    expect(transferForm).toBeInTheDocument();

    await userEvent.click(swapTab);
    const swapForm = screen.getByRole('form', { name: 'swap' });
    expect(swapForm).toBeInTheDocument();

    await userEvent.click(transferTab);
    transferForm = screen.getByRole('form', { name: 'transfer' });
    expect(transferForm).toBeInTheDocument();
  });

  it('does not render tabs when a single operation is available', async () => {
    render(
      <OperationDialog
        open
        operations={['swap']}
        operationData={operationData}
        portfolios={portfolios}
        onOpenChange={() => {}}
      />
    );

    const swapTab = screen.queryByRole('tab', { name: 'swap' });
    const swapTitle = screen.getByRole('heading', { level: 3, name: 'Swap' });
    const swapForm = await screen.findByRole('form', { name: 'swap' });

    expect(swapTab).not.toBeInTheDocument();
    expect(swapTitle).toBeInTheDocument();
    expect(swapForm).toBeInTheDocument();
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

  describe('transfer', () => {
    it('allows tranfer from fixed to stock float', async () => {
      const operationData = {
        portfolio: 'suricat',
        originAsset: { class: 'fixed', name: 'iti' },
        destinyAsset: { class: 'stock', name: 'float' },
      } as const;

      render(
        <OperationDialog
          open
          operations={['swap', 'transfer']}
          operationData={operationData}
          portfolios={portfolios}
          onOpenChange={() => {}}
        />
      );

      const transferTab = screen.getByRole('tab', { name: 'Transfer' });
      await userEvent.click(transferTab);
      const transferForm = await screen.findByRole('form', {
        name: 'transfer',
      });

      expect(transferForm).toBeInTheDocument();
    });

    it('allows tranfer from fixed to crypto hodl', async () => {
      const operationData = {
        portfolio: 'suricat',
        originAsset: { class: 'fixed', name: 'iti' },
        destinyAsset: { class: 'crypto', name: 'hodl' },
      } as const;

      render(
        <OperationDialog
          open
          operations={['swap', 'transfer']}
          operationData={operationData}
          portfolios={portfolios}
          onOpenChange={() => {}}
        />
      );

      const transferTab = screen.getByRole('tab', { name: 'Transfer' });
      await userEvent.click(transferTab);
      const transferForm = await screen.findByRole('form', {
        name: 'transfer',
      });

      expect(transferForm).toBeInTheDocument();
    });

    it('allows tranfer from fixed to crypto binanceBuffer', async () => {
      const operationData = {
        portfolio: 'suricat',
        originAsset: { class: 'fixed', name: 'iti' },
        destinyAsset: { class: 'crypto', name: 'binanceBuffer' },
      } as const;

      render(
        <OperationDialog
          open
          operations={['swap', 'transfer']}
          operationData={operationData}
          portfolios={portfolios}
          onOpenChange={() => {}}
        />
      );

      const transferTab = screen.getByRole('tab', { name: 'Transfer' });
      await userEvent.click(transferTab);
      const transferForm = await screen.findByRole('form', {
        name: 'transfer',
      });

      expect(transferForm).toBeInTheDocument();
    });

    it('allows tranfer from fixed to crypto backed', async () => {
      const operationData = {
        portfolio: 'suricat',
        originAsset: { class: 'fixed', name: 'iti' },
        destinyAsset: { class: 'crypto', name: 'backed' },
      } as const;

      render(
        <OperationDialog
          open
          operations={['swap', 'transfer']}
          operationData={operationData}
          portfolios={portfolios}
          onOpenChange={() => {}}
        />
      );

      const transferTab = screen.getByRole('tab', { name: 'Transfer' });
      await userEvent.click(transferTab);
      const transferForm = await screen.findByRole('form', {
        name: 'transfer',
      });

      expect(transferForm).toBeInTheDocument();
    });

    it('does not allow transfer from stock asset other than float', async () => {
      const operationData = {
        portfolio: 'suricat',
        originAsset: { class: 'stock', name: 'fii' },
        destinyAsset: { class: 'fixed', name: 'nubank' },
      } as const;

      render(
        <OperationDialog
          open
          operations={['swap', 'transfer']}
          operationData={operationData}
          portfolios={portfolios}
          onOpenChange={() => {}}
        />
      );

      const transferTab = screen.queryByRole('tab', { name: 'transfer' });
      const swapTitle = screen.getByRole('heading', { level: 3, name: 'Swap' });
      const swapForm = await screen.findByRole('form', { name: 'swap' });

      expect(transferTab).not.toBeInTheDocument();
      expect(swapTitle).toBeInTheDocument();
      expect(swapForm).toBeInTheDocument();
    });

    it('does not allow transfer to stock asset other than float', async () => {
      const operationData = {
        portfolio: 'suricat',
        originAsset: { class: 'fixed', name: 'nubank' },
        destinyAsset: { class: 'stock', name: 'fii' },
      } as const;

      render(
        <OperationDialog
          open
          operations={['swap', 'transfer']}
          operationData={operationData}
          portfolios={portfolios}
          onOpenChange={() => {}}
        />
      );

      const transferTab = screen.queryByRole('tab', { name: 'transfer' });
      const swapTitle = screen.getByRole('heading', { level: 3, name: 'Swap' });
      const swapForm = await screen.findByRole('form', { name: 'swap' });

      expect(transferTab).not.toBeInTheDocument();
      expect(swapTitle).toBeInTheDocument();
      expect(swapForm).toBeInTheDocument();
    });

    it('does not allow transfer from crypto asset other than hodl, binanceBuffer or backed', async () => {
      const operationData = {
        portfolio: 'suricat',
        originAsset: { class: 'crypto', name: 'defi' },
        destinyAsset: { class: 'fixed', name: 'nubank' },
      } as const;

      render(
        <OperationDialog
          open
          operations={['swap', 'transfer']}
          operationData={operationData}
          portfolios={portfolios}
          onOpenChange={() => {}}
        />
      );

      const transferTab = screen.queryByRole('tab', { name: 'transfer' });
      const swapTitle = screen.getByRole('heading', { level: 3, name: 'Swap' });
      const swapForm = await screen.findByRole('form', { name: 'swap' });

      expect(transferTab).not.toBeInTheDocument();
      expect(swapTitle).toBeInTheDocument();
      expect(swapForm).toBeInTheDocument();
    });

    it('does not allow transfer to crypto asset other than hodl, binanceBuffer or backed', async () => {
      const operationData = {
        portfolio: 'suricat',
        originAsset: { class: 'fixed', name: 'nubank' },
        destinyAsset: { class: 'crypto', name: 'defi' },
      } as const;

      render(
        <OperationDialog
          open
          operations={['swap', 'transfer']}
          operationData={operationData}
          portfolios={portfolios}
          onOpenChange={() => {}}
        />
      );

      const transferTab = screen.queryByRole('tab', { name: 'transfer' });
      const swapTitle = screen.getByRole('heading', { level: 3, name: 'Swap' });
      const swapForm = await screen.findByRole('form', { name: 'swap' });

      expect(transferTab).not.toBeInTheDocument();
      expect(swapTitle).toBeInTheDocument();
      expect(swapForm).toBeInTheDocument();
    });
  });
});
