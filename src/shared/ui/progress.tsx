'use client';

import { Progress as ProgressPrimitive } from '@base-ui/react/progress';

import { cn } from '@/shared/lib/utils';

const Progress = ({ className, children, value, ...props }: ProgressPrimitive.Root.Props) => {
  return (
    <ProgressPrimitive.Root
      className={cn('flex flex-wrap gap-3', className)}
      value={value}
      data-slot='progress'
      {...props}
    >
      {children}
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </ProgressPrimitive.Root>
  );
};

const ProgressTrack = ({ className, ...props }: ProgressPrimitive.Track.Props) => {
  return (
    <ProgressPrimitive.Track
      className={cn(
        'bg-muted relative flex h-1.5 w-full items-center overflow-x-hidden rounded-full',
        className
      )}
      data-slot='progress-track'
      {...props}
    />
  );
};

const ProgressIndicator = ({ className, ...props }: ProgressPrimitive.Indicator.Props) => {
  return (
    <ProgressPrimitive.Indicator
      className={cn('bg-primary h-full transition-all', className)}
      data-slot='progress-indicator'
      {...props}
    />
  );
};

const ProgressLabel = ({ className, ...props }: ProgressPrimitive.Label.Props) => {
  return (
    <ProgressPrimitive.Label
      className={cn('text-sm font-medium', className)}
      data-slot='progress-label'
      {...props}
    />
  );
};

const ProgressValue = ({ className, ...props }: ProgressPrimitive.Value.Props) => {
  return (
    <ProgressPrimitive.Value
      className={cn('text-muted-foreground ml-auto text-sm tabular-nums', className)}
      data-slot='progress-value'
      {...props}
    />
  );
};

export { Progress, ProgressIndicator, ProgressLabel, ProgressTrack, ProgressValue };
