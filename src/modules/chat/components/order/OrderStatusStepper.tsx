import { cn } from '@/shared/lib/utils';

interface Props {
  currentStatusIndex: number;
  isCompleted: boolean;
  statuses: readonly string[];
  onNextStatus: () => void;
}

export const OrderStatusStepper = ({
  currentStatusIndex,
  statuses,
  onNextStatus,
  isCompleted
}: Props) => {
  return (
    <div className='sticky top-0 mx-auto w-3xl rounded-[40px] bg-white p-3 shadow-md'>
      <div className='flex w-full items-center gap-2'>
        {statuses.map((status, index) => {
          const isCurrent = index === currentStatusIndex;
          const isPassed = index <= currentStatusIndex;

          return (
            <div
              key={status}
              className={cn('flex items-center gap-2', index < statuses.length - 1 && 'flex-1')}
            >
              <div className='flex items-center gap-2' onClick={onNextStatus}>
                <span
                  className={cn(
                    'inline-flex size-6 items-center justify-center rounded-full border text-xs font-semibold',
                    isPassed || isCompleted
                      ? 'border-success bg-success/20 text-success ring-success/30 ring-2 ring-offset-1'
                      : 'text-muted-foreground border-border bg-background',
                    isCurrent &&
                      'border-primary bg-primary text-primary-foreground ring-primary/30 ring-2 ring-offset-1'
                  )}
                >
                  {index + 1}
                </span>
                <span
                  className={cn(
                    'text-xs font-medium whitespace-nowrap',
                    isPassed ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {status}
                </span>
              </div>
              {index < statuses.length - 1 && <div className={cn('bg-primary h-px flex-1')} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};
