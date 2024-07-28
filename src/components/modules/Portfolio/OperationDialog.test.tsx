import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { formatAssetName } from '@/lib/formatString';
import { formatCurrency } from '@/lib/formatNumber';
import OperationDialog from './OperationDialog';
import { mockedTransfer } from './__mocks__/useTransfer';
import portfolios from '../../../../mockData/api/portfolio/portfolios';
import { fillFormField } from '@/testUtils/forms';

vi.mock('../Fixed/setFixedAssetValue');
vi.mock('../Fixed/getFixedBalance');
vi.mock('../Stock/setStockAssetValue');
vi.mock('../Stock/getStockAssetPosition');
vi.mock('./useTransfer');
vi.mock('./useSwap');
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

  it('submits the form if user confirms it on confirm dialog', async () => {
    render(
      <OperationDialog
        open
        operations={['transfer', 'swap']}
        operationData={operationData}
        portfolios={portfolios}
        onOpenChange={() => {}}
      />
    );

    await fillFormField('Value', 1000);
    const submitButton = screen.getByRole('button', {
      name: 'Submit',
    });
    await userEvent.click(submitButton);
    await confirm('Yes');

    expect(mockedTransfer).toBeCalledTimes(1);
    expect(mockedTransfer).toBeCalledWith({
      portfolio: operationData.portfolio,
      origin: operationData.originAsset,
      destiny: operationData.destinyAsset,
      value: 1000,
    });
  });

  it('does not submit the form if user do not confirm it on confirm dialog', async () => {
    render(
      <OperationDialog
        open
        operations={['transfer', 'swap']}
        operationData={operationData}
        portfolios={portfolios}
        onOpenChange={() => {}}
      />
    );

    await fillFormField('Value', 1000);
    const submitButton = screen.getByRole('button', {
      name: 'Submit',
    });
    await userEvent.click(submitButton);

    await confirm('No');
    expect(mockedTransfer).not.toBeCalled();
  });

  it('renders error message if server fails', async () => {
    const errorMessage = 'Error message!';
    mockedTransfer.mockRejectedValueOnce(new Error(errorMessage));

    render(
      <OperationDialog
        open
        operations={['transfer', 'swap']}
        operationData={operationData}
        portfolios={portfolios}
        onOpenChange={() => {}}
      />
    );

    await fillFormField('Value', 1000);
    const submitButton = screen.getByRole('button', {
      name: 'Submit',
    });
    await userEvent.click(submitButton);
    await confirm('Yes');

    const errorMessageElement = screen.getByText(errorMessage);
    expect(errorMessageElement).toBeInTheDocument();
  });

  it('renders current asset values under the field to update current asset values', async () => {
    const operationData = {
      portfolio: 'financiamento',
      originAsset: { class: 'fixed', name: 'inco' },
      destinyAsset: { class: 'stock', name: 'float' },
    } as const;

    render(
      <OperationDialog
        open
        operations={['transfer', 'swap']}
        operationData={operationData}
        portfolios={portfolios}
        onOpenChange={() => {}}
      />
    );

    const originCurrentValueField = await screen.findByRole('spinbutton', {
      name: `Origin (${formatAssetName(
        operationData.originAsset
      )}) Current Value`,
    });
    const destinyCurrentValueField = screen.getByRole('spinbutton', {
      name: `Destiny (${formatAssetName(
        operationData.destinyAsset
      )}) Current Value`,
    });

    expect(originCurrentValueField).toHaveAccessibleDescription(
      `Current value: ${formatCurrency(10891.02)}`
    );
    expect(destinyCurrentValueField).toHaveAccessibleDescription(
      `Current value: ${formatCurrency(100)}`
    );
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
