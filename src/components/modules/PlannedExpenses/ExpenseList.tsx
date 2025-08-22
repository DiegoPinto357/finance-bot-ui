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
    <div data-testid="expense-list" className="flex flex-col">
      <div className="shrink-0">
        <Typography variant="h2" data-testid="total-heading" className="my-4">
          Total: {formatCurrency(totalAmount)}
        </Typography>
        {/* Add controls here if needed */}
      </div>

      <div className="flex-1 min-h-0 max-h-[60vh] overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1 h-full">
          {portfolioInstallments.map(portfolioGroup => (
            <Card key={portfolioGroup.portfolio} className="mb-0">
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
      </div>
    </div>
  );
};

export default ExpenseList;
