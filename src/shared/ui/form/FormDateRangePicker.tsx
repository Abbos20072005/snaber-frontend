import type { DateRange } from 'react-day-picker';

import { useLingui } from '@lingui/react/macro';
import { format, parseISO } from 'date-fns';
import { ChevronDownIcon, Trash2Icon } from 'lucide-react';
import React from 'react';

import { formatDateToString } from '@/shared/lib/format';
import { cn } from '@/shared/lib/utils';

import type { FormControlProps } from './FormBase';

import { Button } from '../button';
import { Calendar } from '../calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { FormBase } from './FormBase';
import { useFieldContext } from './hooks';

interface DateRangeValue {
  from?: string;
  to?: string;
}

interface Props extends FormControlProps {
  calendarProps?: React.ComponentProps<typeof Calendar>;
  placeholder?: string;
}

export const FormDateRangePicker = ({ calendarProps, placeholder, ...props }: Props) => {
  const { t } = useLingui();
  const field = useFieldContext<DateRangeValue | undefined>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const [open, setOpen] = React.useState(false);

  const selectedRange: DateRange | undefined = React.useMemo(() => {
    const v = field.state.value;
    if (!v?.from && !v?.to) return undefined;

    return {
      from: v.from ? parseISO(v.from) : undefined,
      to: v.to ? parseISO(v.to) : undefined
    };
  }, [field.state.value]);

  const triggerLabel = React.useMemo(() => {
    if (!selectedRange?.from) return placeholder || 'Sanani tanlang';
    if (!selectedRange.to) return format(selectedRange.from, 'dd/MM/yyyy');
    return `${format(selectedRange.from, 'dd/MM/yyyy')} – ${format(selectedRange.to, 'dd/MM/yyyy')}`;
  }, [placeholder, selectedRange]);

  const hasValue = Boolean(field.state.value?.from || field.state.value?.to);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <FormBase {...props}>
        <PopoverTrigger
          render={
            <Button
              className={cn('w-48 justify-between font-normal', {
                'text-muted-foreground': !hasValue
              })}
              aria-invalid={isInvalid}
              id={field.name}
              variant='outline'
              onBlur={field.handleBlur}
            >
              {triggerLabel}
              <ChevronDownIcon />
            </Button>
          }
        />
      </FormBase>

      <PopoverContent align='start' className='w-auto overflow-hidden p-1'>
        <Calendar
          captionLayout='dropdown'
          {...calendarProps}
          selected={selectedRange}
          endMonth={new Date(3000, 0)}
          mode='range'
          onSelect={(range) => {
            if (!range?.from) {
              field.handleChange(undefined);
              return;
            }
            field.handleChange({
              from: formatDateToString(range.from),
              to: range.to ? formatDateToString(range.to) : undefined
            });
            // if (range.from && range.to) setOpen(false);
          }}
        />

        {hasValue && (
          <Button
            className='w-full'
            size='sm'
            variant='outline'
            onClick={() => field.handleChange(undefined)}
          >
            <Trash2Icon />
            {t`Clear`}
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
};
