import { forwardRef, useImperativeHandle, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import FormField from '@/components/lib/FormField';
import FormCheckbox from '@/components/lib/FormCheckbox';
import { currencyField, optionalCurrencyField } from '@/lib/formFieldSchema';
import { formatCurrency } from '@/lib/formatNumber';
import { formatAssetName } from '@/lib/formatString';
import useTransfer from './useTransfer';
import useSetAssetValue from './useSetAssetValue';

import type { Asset } from '@/types';
import type { DragAndDropOperationData, CurrentAssetValues } from './types';

const createFormSchema = (isValueOptional: boolean) =>
  z.object({
    originCurrentValue: optionalCurrencyField,
    destinyCurrentValue: optionalCurrencyField,
    allFundsValue: z.coerce.boolean(),
    value: isValueOptional ? currencyField.optional() : currencyField,
  });

type FormSchema = z.infer<ReturnType<typeof createFormSchema>>;

type TransferFormSchema = Partial<FormSchema>;

type DefaultValues = Partial<
  Record<keyof FormSchema, string | number | boolean>
>;

const defaultValues: DefaultValues = {
  originCurrentValue: '',
  destinyCurrentValue: '',
  allFundsValue: '',
  value: '',
} as const;

const manualFetchBalance = [
  { class: 'fixed' },
  { class: 'stock', name: 'float' },
];

const needManualUpdate = (asset: Asset) =>
  manualFetchBalance.some(
    manualUpdatedAsset =>
      manualUpdatedAsset.class === asset.class &&
      (manualUpdatedAsset.name === undefined ||
        manualUpdatedAsset.name === asset.name)
  );

type Props = {
  operationData: DragAndDropOperationData;
  currentAssetValues: CurrentAssetValues;
  data?: TransferFormSchema;
  onSubmmit: () => void;
  onError: (errorMessage: string) => void;
};

const TransferForm = forwardRef(
  (
    { operationData, currentAssetValues, data, onSubmmit, onError }: Props,
    ref
  ) => {
    const [valueFieldDisabled, setValueFieldDisabled] =
      useState<boolean>(false);

    const form = useForm<DefaultValues, void, FormSchema>({
      resolver: zodResolver(createFormSchema(valueFieldDisabled)),
      defaultValues: { ...defaultValues, ...data },
    });

    useImperativeHandle(ref, () => ({
      validate: () => form.trigger(),
    }));

    const { transfer } = useTransfer();
    // TODO need to set values for all asset classes
    const { setAssetValue } = useSetAssetValue();

    const { originAsset, destinyAsset } = operationData;
    const { originCurrentValue, destinyCurrentValue } = currentAssetValues;

    const handleSubmit = useCallback(
      async ({
        originCurrentValue,
        destinyCurrentValue,
        value,
        allFundsValue,
      }: FormSchema) => {
        const { portfolio, originAsset, destinyAsset } = operationData;
        try {
          if (originCurrentValue) {
            await setAssetValue({
              asset: originAsset,
              value: originCurrentValue,
            });
          }

          if (destinyCurrentValue) {
            await setAssetValue({
              asset: destinyAsset,
              value: destinyCurrentValue,
            });
          }

          await transfer({
            portfolio: portfolio,
            origin: originAsset,
            destiny: destinyAsset,
            value: allFundsValue ? 'all' : value || 0,
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
          className="grid content-start grid-cols-1 gap-4 h-[420px]"
          noValidate
        >
          {needManualUpdate(originAsset) ? (
            <FormField
              control={form.control}
              name="originCurrentValue"
              label={`Origin (${formatAssetName(originAsset)}) Current Value`}
              description={`Current value: ${formatCurrency(
                originCurrentValue
              )}`}
              type="number"
            />
          ) : null}

          {needManualUpdate(destinyAsset) ? (
            <FormField
              control={form.control}
              name="destinyCurrentValue"
              label={`Destiny (${formatAssetName(destinyAsset)}) Current Value`}
              description={`Current value: ${formatCurrency(
                destinyCurrentValue
              )}`}
              type="number"
            />
          ) : null}

          <FormCheckbox
            control={form.control}
            name="allFundsValue"
            label="Transfer all funds"
            onChange={setValueFieldDisabled}
          />

          <FormField
            control={form.control}
            name="value"
            label="Value"
            type="number"
            disabled={valueFieldDisabled}
          />
        </form>
      </Form>
    );
  }
);

export default TransferForm;
