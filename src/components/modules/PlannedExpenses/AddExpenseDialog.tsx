import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../../ui/dialog';
import { Form } from '../../ui/form';
import FormField from '../../lib/FormField';
import FormSelect from '../../lib/FormSelect';
import useGetPortfolios from '../Portfolio/useGetPortfolios';
import useAddPlannedExpense from './useAddPlannedExpense';
import { MONTHS } from '../../../lib/constants';
import FormMonthPicker from '../../lib/FormMonthPicker';
import { Plus } from 'lucide-react';
import ConfirmDialog from '../../lib/ConfirmDialog';
import { currencyField } from '@/lib/formFieldSchema';

const formSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  portfolio: z.string().min(1, 'Portfolio is required'),
  totalAmount: currencyField,
  installments: z.coerce.number().int().min(1, 'At least one installment'),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}$/)
    .min(1, 'Start date is required'),
});

type FormSchemaType = z.infer<typeof formSchema>;

const AddExpenseDialog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const dialogContentRef = useRef<HTMLDivElement>(null);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      portfolio: '',
      installments: 1,
      startDate: new Date().toISOString().slice(0, 7),
    },
  });

  const { mutateAsync: addExpense, isLoading: isAddingExpense } =
    useAddPlannedExpense();
  const { data: portfolios, isLoading: isLoadingPortfolios } =
    useGetPortfolios();

  const onSubmit = async (data: FormSchemaType) => {
    const { totalAmount, startDate, ...rest } = data;
    const [startYear, startMonthNum] = startDate.split('-').map(Number);
    const startMonth = MONTHS[startMonthNum - 1];
    await addExpense({
      ...rest,
      totalValue: totalAmount,
      startMonth,
      startYear,
    });
    setIsDialogOpen(false);
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus />
            Add Expense
          </Button>
        </DialogTrigger>
        <DialogContent ref={dialogContentRef} className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Add Planned Expense</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              id="add-expense-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="description"
                label="Description"
              />

              <div className="flex gap-4">
                <FormSelect
                  className="flex-1"
                  control={form.control}
                  name="portfolio"
                  label="Portfolio"
                  options={portfolios || []}
                  disabled={isLoadingPortfolios}
                />
                <FormMonthPicker
                  control={form.control}
                  name="startDate"
                  label="Start Date"
                  container={dialogContentRef.current}
                  className="flex-1"
                />
              </div>

              <div className="flex gap-4">
                <FormField
                  className="flex-1"
                  control={form.control}
                  name="totalAmount"
                  label="Total Amount"
                  type="number"
                />
                <FormField
                  className="flex-1"
                  control={form.control}
                  name="installments"
                  label="Installments"
                  type="number"
                />
              </div>
            </form>
          </Form>

          <DialogFooter className="pt-4">
            <Button
              className="w-full"
              disabled={isAddingExpense}
              onClick={async () => {
                if (await form.trigger()) {
                  setConfirmDialogOpen(true);
                }
              }}
            >
              Submit expense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={isConfirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        form="add-expense-form"
      />
    </>
  );
};

export default AddExpenseDialog;
