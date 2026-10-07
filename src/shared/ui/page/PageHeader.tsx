import React from 'react';

import { cn } from '@/shared/lib/utils';

interface AppHeaderProps extends React.ComponentProps<'header'> {
  children?: React.ReactNode;
}

export const PageHeader = ({ ref, className, children, ...props }: AppHeaderProps) => {
  return (
    <header
      ref={ref}
      className={cn(
        'flex h-18 items-center gap-2 px-6',
        className
      )}
      {...props}
    >
      {children}
    </header>
  );
};
PageHeader.displayName = 'AppHeader';
