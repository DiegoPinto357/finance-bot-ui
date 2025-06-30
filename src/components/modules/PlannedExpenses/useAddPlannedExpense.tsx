import { useMutation, useQueryClient } from 'react-query';
import { addPlannedExpense } from '../../../services/plannedExpenses';

export const useAddPlannedExpense = () => {
  const queryClient = useQueryClient();

  return useMutation(addPlannedExpense, {
    onSuccess: () => {
      queryClient.invalidateQueries('planned-expenses');
    },
  });
};
