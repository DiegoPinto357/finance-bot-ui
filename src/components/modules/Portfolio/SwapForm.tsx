import { forwardRef, useImperativeHandle, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import FormField from '@/components/lib/FormField';
import FormCheckbox from '@/components/lib/FormCheckbox';
import FormSelect from '@/components/lib/FormSelect';
import { currencyField, optionalCurrencyField } from '@/lib/formFieldSchema';
import { formatCurrency } from '@/lib/formatNumber';
import { formatAssetName } from '@/lib/formatString';
import useSwap from './useSwap';
import useSetAssetValue from '../Fixed/useSetAssetValue';

import type { DragAndDropOperationData, CurrentAssetValues } from './types';

const createFormSchema = (isValueOptional: boolean) =>
  z.object({
    liquidityProvider: z.string().min(1), // TODO select with list of portfolios
    originCurrentValue: optionalCurrencyField,
    destinyCurrentValue: optionalCurrencyField,
    allFundsValue: z.coerce.boolean(),
    value: isValueOptional ? currencyField.optional() : currencyField,
  });

type FormSchema = z.infer<ReturnType<typeof createFormSchema>>;

type SwapFormSchema = Partial<FormSchema>;

type DefaultValues = Partial<
  Record<keyof FormSchema, string | number | boolean>
>;

const defaultValues: DefaultValues = {
  liquidityProvider: 'amortecedor',
  originCurrentValue: '',
  destinyCurrentValue: '',
  allFundsValue: '',
  value: '',
} as const;

type Props = {
  operationData: DragAndDropOperationData;
  currentAssetValues: CurrentAssetValues;
  portfolios: string[];
  data?: SwapFormSchema;
  onSubmmit: () => void;
  onError: (errorMessage: string) => void;
};

const SwapForm = forwardRef(
  (
    {
      operationData,
      currentAssetValues,
      portfolios,
      data,
      onSubmmit,
      onError,
    }: Props,
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

    const { swap } = useSwap();
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
        liquidityProvider,
      }: FormSchema) => {
        const { portfolio, originAsset, destinyAsset } = operationData;

        try {
          if (portfolio === liquidityProvider) {
            throw new Error(
              'Portfolio and liquidity provider must not be the same.'
            );
          }

          if (originCurrentValue) {
            await setAssetValue({
              asset: originAsset.name,
              value: originCurrentValue,
            });
          }

          if (destinyCurrentValue) {
            await setAssetValue({
              asset: destinyAsset.name,
              value: destinyCurrentValue,
            });
          }

          await swap({
            portfolio: portfolio,
            origin: originAsset,
            destiny: destinyAsset,
            value: allFundsValue ? 'all' : value || 0,
            liquidity: liquidityProvider,
          });

          onSubmmit();
        } catch (error) {
          if (error instanceof Error) onError(error.message);
          else onError(String(error));
        }
      },
      [operationData, setAssetValue, swap, onSubmmit, onError]
    );

    return (
      <Form {...form}>
        <form
          id="operation-form"
          aria-label="swap"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="grid content-start grid-cols-1 gap-4 h-[406px]"
          noValidate
        >
          <FormField
            control={form.control}
            name="originCurrentValue"
            label={`Origin (${formatAssetName(originAsset)}) Current Value`}
            description={`Current value: ${formatCurrency(originCurrentValue)}`}
            type="number"
          />

          <FormField
            control={form.control}
            name="destinyCurrentValue"
            label={`Destiny (${formatAssetName(destinyAsset)}) Current Value`}
            description={`Current value: ${formatCurrency(
              destinyCurrentValue
            )}`}
            type="number"
          />

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

          <FormSelect
            control={form.control}
            name="liquidityProvider"
            label="Liquidity Provider"
            options={portfolios}
          />
        </form>
      </Form>
    );
  }
);

export default SwapForm;
