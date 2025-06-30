import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Form } from '../../ui/form';
import FormField from '../../lib/FormField';
import FormSelect from '../../lib/FormSelect';
import { useAddPlannedExpense } from './useAddPlannedExpense';

const formSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória'),
  portfolio: z.string().min(1, 'Portfólio é obrigatório'),
  totalAmount: z.coerce.number().min(0.01, 'Valor deve ser maior que zero'),
  installments: z.coerce.number().int().min(1, 'Pelo menos uma parcela'),
  startDate: z.string().min(1, 'Data de início é obrigatória'),
});

type FormSchemaType = z.infer<typeof formSchema>;

const AddExpenseDialog = () => {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      portfolio: '',
      totalAmount: 0,
      installments: 1,
      startDate: new Date().toISOString().split('T')[0],
    },
  });

  const { mutate: addExpense, isLoading } = useAddPlannedExpense();

  const onSubmit = (data: FormSchemaType) => {
    addExpense(data);
  };

  // Mocked portfolios - replace with actual data
  const portfolios = ['Essencial', 'Investimentos', 'Lazer'];

  return (
    <Dialog>
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
            <FormField
              control={form.control}
              name="startDate"
              label="Data de Início"
              type="date"
            />
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
