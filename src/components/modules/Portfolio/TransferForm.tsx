import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useTransfer from './useTransfer';

const formSchema = z.object({
  portfolio: z.string().min(1),
  origin: z.string().min(1),
  destiny: z.string().min(1),
  value: z.coerce.number().multipleOf(0.01).positive().min(1),
});

type FormSchema = z.infer<typeof formSchema>;

export type TransferFormSchema = Partial<FormSchema>;

type DefaultValues = Record<keyof FormSchema, string | number>;

const defaultValues: DefaultValues = {
  portfolio: '',
  origin: '',
  destiny: '',
  value: '',
};

type Props = {
  data?: TransferFormSchema;
};

const TransferForm = ({ data }: Props) => {
  const form = useForm<DefaultValues, void, FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { ...defaultValues, ...data },
  });

  const { transfer } = useTransfer();

  const handleSubmit = useCallback(
    async (values: FormSchema) => {
      await transfer({
        portfolio: values.portfolio,
        origin: { class: 'fixed', name: values.origin },
        destiny: { class: 'fixed', name: values.destiny },
        value: values.value,
      });
    },
    [transfer]
  );

  return (
    <Form {...form}>
      <form
        id="operation-form"
        aria-label="transfer"
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-8"
        noValidate
      >
        <FormField
          control={form.control}
          name="portfolio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Portfolio</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="origin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Origin</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="destiny"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Destiny</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Value</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default TransferForm;
