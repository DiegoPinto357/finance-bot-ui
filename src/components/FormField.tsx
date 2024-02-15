import {
  FormControl,
  // FormDescription,
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
  type?: React.HTMLInputTypeAttribute;
};

const FormField = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  type,
}: Props<TFieldValues>) => {
  return (
    <DefaultFormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...field} type={type} />
          </FormControl>
          {/* <FormDescription>
        This is your public display name.
      </FormDescription> */}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormField;
