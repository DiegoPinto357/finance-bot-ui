import * as React from 'react';
import { Control, FieldValues, Path } from 'react-hook-form';
import { Button } from '../ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { CalendarIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { MonthPicker } from '../ui/monthpicker';
import { formatMonthYear, monthYearStringToDate } from '@/lib/formatDate';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';

type Props<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  container?: HTMLElement | null;
};

const FormMonthPicker = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  container,
}: Props<TFieldValues>) => {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !field.value && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value ? (
                    formatMonthYear(field.value)
                  ) : (
                    <span>Pick a month</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" container={container}>
                <MonthPicker
                  selectedMonth={monthYearStringToDate(field.value)}
                  onMonthSelect={date => {
                    const value = `${date.getFullYear()}-${String(
                      date.getMonth() + 1
                    ).padStart(2, '0')}`;
                    field.onChange(value);
                    setIsPopoverOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormMonthPicker;
