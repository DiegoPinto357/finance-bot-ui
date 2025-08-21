import {
  FormControl,
  FormDescription,
  FormField as DefaultFormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import type { Control, FieldValues, Path } from 'react-hook-form';

type Props<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  description?: string;
  type?: React.HTMLInputTypeAttribute;
  disabled?: boolean;
  className?: string;
};

const FormField = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  type,
  disabled,
  className,
}: Props<TFieldValues>) => {
  return (
    <DefaultFormField
      control={control}
      name={name}
      disabled={disabled}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...field} type={type} value={field.value ?? ''} />
          </FormControl>
          {description ? (
            <FormDescription>{description}</FormDescription>
          ) : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormField;
