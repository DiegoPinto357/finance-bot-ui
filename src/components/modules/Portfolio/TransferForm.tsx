import { forwardRef, useImperativeHandle, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import FormField from '@/components/FormField';
import { formatCurrency } from '@/lib/formatNumber';

import useTransfer from './useTransfer';
import useGetFixedBalance from '../Fixed/useGetFixedBalance';
import useSetAssetValue from '../Fixed/useSetAssetValue';

import { DragAndDropOperationData } from './types';

const formSchema = z.object({
  originCurrentValue: z.coerce.number().multipleOf(0.01).positive().min(0),
  destinyCurrentValue: z.coerce.number().multipleOf(0.01).positive().min(0),
  value: z.coerce.number().multipleOf(0.01).positive().min(1),
});

type FormSchema = z.infer<typeof formSchema>;

export type TransferFormSchema = Partial<FormSchema>;

type DefaultValues = Record<keyof FormSchema, string | number>;

const defaultValues: DefaultValues = {
  originCurrentValue: '',
  destinyCurrentValue: '',
  value: '',
};

type Props = {
  operationData: DragAndDropOperationData;
  data?: TransferFormSchema;
  onSubmmit: () => void;
  onError: (errorMessage: string) => void;
};

const TransferForm = forwardRef(
  ({ operationData, data, onSubmmit, onError }: Props, ref) => {
    const form = useForm<DefaultValues, void, FormSchema>({
      resolver: zodResolver(formSchema),
      defaultValues: { ...defaultValues, ...data },
    });

    useImperativeHandle(ref, () => ({
      validate: () => form.trigger(),
    }));

    const { originAsset, destinyAsset } = operationData;
    // TODO move this call to Operations form to avoid it being called everytime the form is changed
    const { data: fixedBalance } = useGetFixedBalance([
      originAsset,
      destinyAsset,
    ]);
    const { transfer } = useTransfer();
    const { setAssetValue } = useSetAssetValue();

    const originCurrentValue = fixedBalance?.balance.find(
      ({ asset }) => asset === originAsset
    )?.value;
    const destinyCurrentValue = fixedBalance?.balance.find(
      ({ asset }) => asset === destinyAsset
    )?.value;

    const handleSubmit = useCallback(
      async ({
        originCurrentValue,
        destinyCurrentValue,
        value,
      }: FormSchema) => {
        const { portfolio, originAsset, destinyAsset } = operationData;
        try {
          await setAssetValue({
            asset: originAsset,
            value: originCurrentValue,
          });
          await setAssetValue({
            asset: destinyAsset,
            value: destinyCurrentValue,
          });
          await transfer({
            portfolio: portfolio,
            origin: { class: 'fixed', name: originAsset },
            destiny: { class: 'fixed', name: destinyAsset },
            value: value,
          });
          onSubmmit();
        } catch (error) {
          if (error instanceof Error) onError(error.message);
          else onError(String(error));
        }
      },
      [operationData, setAssetValue, transfer, onSubmmit, onError]
    );

    return (
      <Form {...form}>
        <form
          id="operation-form"
          aria-label="transfer"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="grid grid-cols-1 gap-4"
          noValidate
        >
          <FormField
            control={form.control}
            name="originCurrentValue"
            label={`Origin (${originAsset}) Current Value`}
            description={`Current value: ${formatCurrency(originCurrentValue)}`}
            type="number"
          />

          <FormField
            control={form.control}
            name="destinyCurrentValue"
            label={`Destiny (${destinyAsset}) Current Value`}
            description={`Current value: ${formatCurrency(
              destinyCurrentValue
            )}`}
            type="number"
          />

          <FormField
            control={form.control}
            name="value"
            label="Value"
            type="number"
          />
        </form>
      </Form>
    );
  }
);

export default TransferForm;
