import { useMutation, useQueryClient } from 'react-query';
import {
  addPlannedExpense,
  AddPlannedExpense,
} from '../../../services/plannedExpenses';

export const useAddPlannedExpense = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (payload: AddPlannedExpense) => addPlannedExpense(payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('monthly-installments');
      },
    }
  );
};
