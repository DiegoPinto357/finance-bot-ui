import { useGetPlannedExpenses } from './useGetPlannedExpenses';
import { useState } from 'react';
import { Button } from '../../ui/button';
import PageHeading from '../../lib/PageHeading';
import Loader from '../../lib/Loader';
import ExpenseList from './ExpenseList';
import AddExpenseDialog from './AddExpenseDialog';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PlannedExpenses = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const handleCurrentMonth = () => {
    setCurrentDate(new Date());
  };

  const monthYear = currentDate.toLocaleString('default', {
    month: 'short',
    year: 'numeric',
  });

  const {
    data: expenses,
    isLoading,
    isFetching,
    refetch,
  } = useGetPlannedExpenses({
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
  });

  return (
    <div className="container mx-auto p-4">
      <PageHeading isRefreshing={isFetching} onRefreshClick={() => refetch()}>
        Planned Expenses
      </PageHeading>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousMonth}
            className="mr-4"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xl font-semibold w-32 text-center">
            {monthYear}
          </span>
          <Button variant="outline" size="icon" onClick={handleNextMonth} className="ml-4">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={handleCurrentMonth} className="ml-4">Mês Atual</Button>
        </div>
        <AddExpenseDialog />
      </div>
      {isLoading ? <Loader /> : <ExpenseList expenses={expenses || []} />}
    </div>
  );
};

export default PlannedExpenses;
