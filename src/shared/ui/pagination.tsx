import { useLingui } from '@lingui/react/macro';
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => {
  return (
    <nav
      aria-label='pagination'
      className={cn('mx-auto flex w-full justify-center', className)}
      data-slot='pagination'
      role='navigation'
      {...props}
    />
  );
};

const PaginationContent = ({ className, ...props }: React.ComponentProps<'ul'>) => {
  return (
    <ul
      className={cn('flex items-center gap-0.5', className)}
      data-slot='pagination-content'
      {...props}
    />
  );
};

const PaginationItem = ({ ...props }: React.ComponentProps<'li'>) => {
  return <li data-slot='pagination-item' {...props} />;
};

type PaginationLinkProps = {
  isActive?: boolean;
  disabled?: boolean;
} & Pick<React.ComponentProps<typeof Button>, 'disabled' | 'size'> &
  React.ComponentProps<'a'>;

const PaginationLink = ({
  className,
  isActive,
  disabled,
  size = 'icon',
  ...props
}: PaginationLinkProps) => {
  return (
    <Button
      render={
        <a
          aria-current={isActive ? 'page' : undefined}
          data-active={isActive}
          data-slot='pagination-link'
          {...props}
        />
      }
      className={cn(className)}
      disabled={disabled}
      size={size}
      variant={isActive ? 'outline' : 'ghost'}
      nativeButton={false}
    />
  );
};

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => {
  const { t } = useLingui();
  return (
    <PaginationLink
      aria-label={t`Go to previous page`}
      className={cn('pl-1.5!', className)}
      size='default'
      {...props}
    >
      <ChevronLeftIcon data-icon='inline-start' />
      <span className='hidden sm:block'>{t`Previous`}</span>
    </PaginationLink>
  );
};

const PaginationNext = ({
  className,

  ...props
}: React.ComponentProps<typeof PaginationLink>) => {
  const { t } = useLingui();
  return (
    <PaginationLink
      aria-label={t`Go to next page`}
      className={cn('pr-1.5!', className)}
      size='default'
      {...props}
    >
      <span className='hidden sm:block'>{t`Next`}</span>
      <ChevronRightIcon data-icon='inline-end' />
    </PaginationLink>
  );
};

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<'span'>) => {
  const { t } = useLingui();
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-8 items-center justify-center [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      data-slot='pagination-ellipsis'
      {...props}
    >
      <MoreHorizontalIcon />
      <span className='sr-only'>{t`More pages`}</span>
    </span>
  );
};

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
};
