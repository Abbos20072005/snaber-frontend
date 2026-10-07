import React from 'react';

import { cn } from '@/shared/lib/utils.ts';

interface MainProps extends React.ComponentProps<'main'> {}

export const PageContent = ({ ref, className, ...props }: MainProps) => {
  return (
    <main
      ref={ref}
      className={cn('bg-background flex-1 overflow-y-auto px-6 py-4', className)}
      {...props}
    />
  );
};
