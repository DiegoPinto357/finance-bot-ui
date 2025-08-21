import { useState } from 'react';
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
} from '../../ui/dialog';
import { Form } from '../../ui/form';
import FormField from '../../lib/FormField';
import FormSelect from '../../lib/FormSelect';
import { MonthPicker } from '../../ui/monthpicker';
import { Popover, PopoverTrigger, PopoverContent } from '../../ui/popover';
import { CalendarIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { useAddPlannedExpense } from './useAddPlannedExpense';
import { MONTHS } from '../../../lib/constants';
import { formatMonthYear, monthYearStringToDate } from '@/lib/formatDate';

const formSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória'),
  portfolio: z.string().min(1, 'Portfólio é obrigatório'),
  totalAmount: z.coerce.number().min(0.01, 'Valor deve ser maior que zero'),
  installments: z.coerce.number().int().min(1, 'Pelo menos uma parcela'),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}$/)
    .min(1, 'Data de início é obrigatória'),
});

type FormSchemaType = z.infer<typeof formSchema>;

const AddExpenseDialog = () => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      portfolio: '',
      totalAmount: 0,
      installments: 1,
      startDate: new Date().toISOString().slice(0, 7),
    },
  });

  const { mutate: addExpense, isLoading } = useAddPlannedExpense();

  const onSubmit = (data: FormSchemaType) => {
    const { totalAmount, startDate, ...rest } = data;
    const [startYear, startMonthNum] = startDate.split('-').map(Number);
    const startMonth = MONTHS[startMonthNum - 1];
    addExpense({ ...rest, totalValue: totalAmount, startMonth, startYear });
  };

  // Mocked portfolios - replace with actual data
  const portfolios = [
    'Essencial',
    'Investimentos',
    'Lazer',
    'Viagem',
    'Financiamento',
  ];

  return (
    <Dialog modal={false}>
      <DialogTrigger asChild>
        <Button>Adicionar Despesa</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Despesa Planejada</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              label="Descrição"
            />
            <FormSelect
              control={form.control}
              name="portfolio"
              label="Portfólio"
              options={portfolios}
            />
            <FormField
              control={form.control}
              name="totalAmount"
              label="Valor Total"
              type="number"
            />
            <FormField
              control={form.control}
              name="installments"
              label="Parcelas"
              type="number"
            />
            <div>
              <label className="block text-sm font-medium mb-1">
                Data de Início
              </label>
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-[280px] justify-start text-left font-normal',
                      !form.watch('startDate') && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.watch('startDate') ? (
                      formatMonthYear(form.watch('startDate'))
                    ) : (
                      <span>Pick a month</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <MonthPicker
                    selectedMonth={monthYearStringToDate(
                      form.watch('startDate')
                    )}
                    onMonthSelect={date => {
                      const value = `${date.getFullYear()}-${String(
                        date.getMonth() + 1
                      ).padStart(2, '0')}`;
                      form.setValue('startDate', value);
                      setIsPopoverOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseDialog;
