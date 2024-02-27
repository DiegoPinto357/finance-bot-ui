import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';

import type { Control, FieldValues, Path } from 'react-hook-form';
import type { CheckedState } from '@radix-ui/react-checkbox';

type Props<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  description?: string;
  onChange?: (checked: boolean) => void;
};

const FormCheckbox = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  onChange,
}: Props<TFieldValues>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const handleOnChange = (checked: CheckedState) => {
          field.onChange(checked);
          if (onChange) onChange(checked === true);
        };

        return (
          <FormItem className="flex flex-row items-start space-x-2 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={handleOnChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>{label}</FormLabel>
              {description ? (
                <FormDescription>{description}</FormDescription>
              ) : null}
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default FormCheckbox;
