import { PlannedExpense } from '../../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';
import { formatCurrency } from '../../../lib/formatNumber';

interface ExpenseListProps {
  expenses: PlannedExpense[];
}

const ExpenseList = ({ expenses }: ExpenseListProps) => {
  const groupedExpenses = expenses.reduce((acc, expense) => {
    const { portfolio } = expense;
    if (!acc[portfolio]) {
      acc[portfolio] = [];
    }
    acc[portfolio].push(expense);
    return acc;
  }, {} as Record<string, PlannedExpense[]>);

  const totalAmount = expenses.reduce(
    (acc, expense) => acc + expense.amount,
    0
  );

  return (
    <div>
      {Object.entries(groupedExpenses).map(([portfolio, expenses]) => {
        const subtotal = expenses.reduce(
          (acc, expense) => acc + expense.amount,
          0
        );
        return (
          <Card key={portfolio} className="mb-4">
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>{portfolio}</span>
                <span>{formatCurrency(subtotal)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Parcela</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map(expense => (
                    <TableRow key={expense.id}>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>{`${expense.currentInstallment}/${expense.installments}`}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(expense.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );
      })}
      <div className="text-right text-xl font-bold mt-4">
        <span>Total:</span>
        <span className="ml-2">{formatCurrency(totalAmount)}</span>
      </div>
    </div>
  );
};

export default ExpenseList;
