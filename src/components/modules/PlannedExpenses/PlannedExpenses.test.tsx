import { render, screen } from '@testing-library/react';
import { useQuery, useMutation } from 'react-query';
import userEvent from '@testing-library/user-event';
import PlannedExpenses from './PlannedExpenses';

vi.mock('react-query');

describe('PlannedExpenses', () => {
  beforeEach(() => {
    // @ts-ignore
    vi.mocked(useQuery).mockReturnValue({
      data: [],
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    });
    // @ts-ignore
    vi.mocked(useMutation).mockReturnValue({
      mutate: vi.fn(),
      isLoading: false,
    });
  });

  it('renders heading and month navigation', () => {
    render(<PlannedExpenses />);
    expect(screen.getByText('Planned Expenses')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Previous month' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Next month' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Current Month' })
    ).toBeInTheDocument();
  });

  it('changes month when navigation buttons are clicked', async () => {
    render(<PlannedExpenses />);
    const monthLabel = screen.getByText(/^[A-Za-z]{3} \d{4}$/);
    const prevBtn = screen.getByRole('button', { name: 'Previous month' });
    const nextBtn = screen.getByRole('button', { name: 'Next month' });
    const currentBtn = screen.getByRole('button', { name: 'Current Month' });

    const initialMonth = monthLabel.textContent;
    await userEvent.click(prevBtn);
    expect(monthLabel.textContent).not.toBe(initialMonth);

    await userEvent.click(nextBtn);
    expect(monthLabel.textContent).toBe(initialMonth);

    await userEvent.click(currentBtn);
    const now = new Date();
    const expectedMonth = now.toLocaleString('default', {
      month: 'short',
      year: 'numeric',
    });
    expect(monthLabel.textContent).toBe(expectedMonth);
  });

  it('shows loader while loading', () => {
    // @ts-ignore
    vi.mocked(useQuery).mockReturnValue({
      data: [],
      isLoading: true,
      isFetching: false,
      refetch: vi.fn(),
    });
    render(<PlannedExpenses />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
    expect(screen.queryByTestId('expense-list')).not.toBeInTheDocument();
  });

  it('renders ExpenseList after loading', async () => {
    render(<PlannedExpenses />);

    expect(await screen.findByTestId('expense-list')).toBeInTheDocument();
    // TODO assert for actual content
  });

  it('renders AddExpenseDialog', () => {
    render(<PlannedExpenses />);

    expect(
      screen.getByRole('button', { name: 'Add Expense' })
    ).toBeInTheDocument();
  });
});
