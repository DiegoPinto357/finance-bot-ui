import { useMutation, useQueryClient } from 'react-query';
import {
  addPlannedExpense,
  AddPlannedExpense,
} from '../../../services/plannedExpenses';

const useAddPlannedExpense = () => {
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

export default useAddPlannedExpense;
