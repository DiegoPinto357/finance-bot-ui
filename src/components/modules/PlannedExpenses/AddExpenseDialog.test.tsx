import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useMutation } from 'react-query';
import AddExpenseDialog from './AddExpenseDialog';
import { fillFormField, selectFormFieldOption } from '@/testUtils/forms';

vi.mock('react-query');

describe('AddExpenseDialog', () => {
  const mockedAddExpense = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // @ts-ignore
    vi.mocked(useMutation).mockImplementation(() => {
      return {
        mutateAsync: mockedAddExpense,
        isLoading: false,
      };
    });
  });

  it('renders the dialog trigger button', () => {
    render(<AddExpenseDialog />);
    expect(
      screen.getByRole('button', { name: 'Add Expense' })
    ).toBeInTheDocument();
  });

  it('opens the dialog when the trigger button is clicked', async () => {
    render(<AddExpenseDialog />);
    const triggerButton = screen.getByRole('button', { name: 'Add Expense' });
    await userEvent.click(triggerButton);
    expect(
      screen.getByRole('heading', { name: 'Add Planned Expense' })
    ).toBeInTheDocument();
  });

  it('submits the form with valid data', async () => {
    render(<AddExpenseDialog />);
    const triggerButton = screen.getByRole('button', { name: 'Add Expense' });
    await userEvent.click(triggerButton);

    await fillFormField('Description', 'Test Expense');
    await selectFormFieldOption('Portfolio', 'Essential');
    await fillFormField('Total Amount', 100);
    await fillFormField('Installments', 1);

    // For the month picker, we need to open the popover and select a month
    const startDateContainer = screen.getByText('Start Date').closest('div');
    const startDateButton = within(startDateContainer!).getByRole('button');
    await userEvent.click(startDateButton);
    const monthToSelect = screen.getByText('Jan');
    await userEvent.click(monthToSelect);

    const saveButton = screen.getByRole('button', { name: 'Submit expense' });
    await userEvent.click(saveButton);

    const confirmButton = screen.getByRole('button', { name: 'Yes' });
    await userEvent.click(confirmButton);

    expect(mockedAddExpense).toHaveBeenCalledTimes(1);
    expect(mockedAddExpense).toHaveBeenCalledWith({
      description: 'Test Expense',
      portfolio: 'Essential',
      totalValue: 100,
      installments: 1,
      startMonth: 'jan',
      startYear: new Date().getFullYear(),
    });
  });

  it('displays validation errors for invalid data', async () => {
    render(<AddExpenseDialog />);
    const triggerButton = screen.getByRole('button', { name: 'Add Expense' });
    await userEvent.click(triggerButton);

    await fillFormField('Installments', 0);

    const saveButton = screen.getByRole('button', { name: 'Submit expense' });
    await userEvent.click(saveButton);

    expect(screen.getByText('Description is required')).toBeInTheDocument();
    expect(screen.getByText('Portfolio is required')).toBeInTheDocument();
    // TODO fix total amount validation
    // expect(
    //   screen.getByText('Value must be greater than zero')
    // ).toBeInTheDocument();
    expect(screen.getByText('At least one installment')).toBeInTheDocument();
  });

  it('closes the dialog on successful submission', async () => {
    render(<AddExpenseDialog />);
    const triggerButton = screen.getByRole('button', { name: 'Add Expense' });
    await userEvent.click(triggerButton);

    await fillFormField('Description', 'Test Expense');
    await selectFormFieldOption('Portfolio', 'Essential');
    await fillFormField('Total Amount', 100);
    await fillFormField('Installments', 1);

    const startDateContainer = screen.getByText('Start Date').closest('div');
    const startDateButton = within(startDateContainer!).getByRole('button');
    await userEvent.click(startDateButton);
    const monthToSelect = screen.getByText('Jan');
    await userEvent.click(monthToSelect);

    const saveButton = screen.getByRole('button', { name: 'Submit expense' });
    await userEvent.click(saveButton);

    const confirmButton = screen.getByRole('button', { name: 'Yes' });
    await userEvent.click(confirmButton);

    expect(
      screen.queryByRole('heading', { name: 'Add Planned Expense' })
    ).not.toBeInTheDocument();
  });
});
