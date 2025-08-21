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
                  <TableHead>Descrição</TableHead>
                  <TableHead>Parcela</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
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
      <div className="text-right text-xl font-bold mt-4">
        <span>Total:</span>
        <span className="ml-2">{formatCurrency(totalAmount)}</span>
      </div>
    </div>
  );
};

export default ExpenseList;
