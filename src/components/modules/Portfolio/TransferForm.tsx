import { forwardRef, useImperativeHandle, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import FormField from '@/components/FormField';
import useTransfer from './useTransfer';
import useSetAssetValue from '../Fixed/useSetAssetValue';

const formSchema = z.object({
  originCurrentValue: z.coerce.number().multipleOf(0.01).positive().min(1),
  destinyCurrentValue: z.coerce.number().multipleOf(0.01).positive().min(1),
  portfolio: z.string().min(1),
  origin: z.string().min(1),
  destiny: z.string().min(1),
  value: z.coerce.number().multipleOf(0.01).positive().min(1),
});

type FormSchema = z.infer<typeof formSchema>;

export type TransferFormSchema = Partial<FormSchema>;

type DefaultValues = Record<keyof FormSchema, string | number>;

const defaultValues: DefaultValues = {
  originCurrentValue: '',
  destinyCurrentValue: '',
  portfolio: '',
  origin: '',
  destiny: '',
  value: '',
};

type Props = {
  data?: TransferFormSchema;
  onSubmmit: () => void;
};

const TransferForm = forwardRef(({ data, onSubmmit }: Props, ref) => {
  const form = useForm<DefaultValues, void, FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { ...defaultValues, ...data },
  });

  useImperativeHandle(ref, () => ({
    validate: () => form.trigger(),
  }));

  const { transfer } = useTransfer();
  const { setAssetValue } = useSetAssetValue();

  const handleSubmit = useCallback(
    async (values: FormSchema) => {
      await setAssetValue({
        asset: values.origin,
        value: values.originCurrentValue,
      });
      await setAssetValue({
        asset: values.destiny,
        value: values.destinyCurrentValue,
      });
      await transfer({
        portfolio: values.portfolio,
        origin: { class: 'fixed', name: values.origin },
        destiny: { class: 'fixed', name: values.destiny },
        value: values.value,
      });
      onSubmmit();
    },
    [setAssetValue, transfer, onSubmmit]
  );

  return (
    <Form {...form}>
      <form
        id="operation-form"
        aria-label="transfer"
        onSubmit={form.handleSubmit(handleSubmit)}
        className="grid grid-cols-2 gap-4"
        noValidate
      >
        <FormField control={form.control} name="origin" label="Origin" />
        <FormField
          control={form.control}
          name="originCurrentValue"
          label="Origin Current Value"
          type="number"
        />

        <FormField control={form.control} name="destiny" label="Destiny" />
        <FormField
          control={form.control}
          name="destinyCurrentValue"
          label="Destiny Current Value"
          type="number"
        />

        <FormField control={form.control} name="portfolio" label="Portfolio" />
        <FormField
          control={form.control}
          name="value"
          label="Value"
          type="number"
        />
      </form>
    </Form>
  );
});

export default TransferForm;
