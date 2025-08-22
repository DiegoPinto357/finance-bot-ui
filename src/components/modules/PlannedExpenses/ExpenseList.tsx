import { PortfolioInstallments } from '../../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';
import Typography from '@/components/lib/Typography';
import { formatCurrency } from '../../../lib/formatNumber';

interface ExpenseListProps {
  portfolioInstallments: PortfolioInstallments[];
}

const ExpenseList = ({ portfolioInstallments }: ExpenseListProps) => {
  const totalAmount = portfolioInstallments.reduce(
    (acc, portfolio) => acc + portfolio.totalValue,
    0
  );

  return (
    <div data-testid="expense-list">
      <Typography variant="h2" data-testid="total-heading" className="my-4">
        Total: {formatCurrency(totalAmount)}
      </Typography>

      {portfolioInstallments.map(portfolioGroup => (
        <Card key={portfolioGroup.portfolio} className="mb-4">
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span>{portfolioGroup.portfolio}</span>
              <span>{formatCurrency(portfolioGroup.totalValue)}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Installment</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolioGroup.installments.map(installment => (
                  <TableRow
                    key={
                      installment.plannedExpenseId +
                      installment.installmentNumber
                    }
                  >
                    <TableCell>{installment.description}</TableCell>
                    <TableCell>{`${installment.installmentNumber}/${installment.totalInstallments}`}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(installment.value)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ExpenseList;
