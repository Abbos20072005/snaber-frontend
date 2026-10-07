import { useLingui } from '@lingui/react/macro';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/shared/lib/utils.ts';
import { Button } from '@/shared/ui/button.tsx';
import { Calendar } from '@/shared/ui/calendar.tsx';
import { Label } from '@/shared/ui/label.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover.tsx';

interface RfqDeadlinePickerProps {
  deadline: Date;
  onDeadlineChange: (date: Date | undefined) => void;
}

export const RfqDeadlinePicker = ({ deadline, onDeadlineChange }: RfqDeadlinePickerProps) => {
  const { t } = useLingui();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className='flex flex-col gap-1.5'>
      <Label>{t`Deadline`}</Label>
      <Popover>
        <PopoverTrigger
          render={
            <Button
              className={cn(
                'w-full justify-start font-normal',
                !deadline && 'text-muted-foreground'
              )}
              variant='outline'
            >
              <CalendarIcon className='mr-2 h-4 w-4 shrink-0' />
              {deadline ? format(deadline, 'PPP') : t`Pick a deadline date`}
            </Button>
          }
        />
        <PopoverContent align='start' className='w-auto p-0'>
          <Calendar
            required
            disabled={{ before: today }}
            selected={deadline}
            mode='single'
            onSelect={onDeadlineChange}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
