import type { LinkProps } from '@tanstack/react-router';
import type { ReactNode } from 'react';

import { useLingui } from '@lingui/react/macro';
import { Link } from '@tanstack/react-router';
import { ArrowRightIcon } from 'lucide-react';

import { buttonVariants } from '@/shared/ui/button.tsx';

import { cn } from '../lib/utils';

interface Props extends LinkProps {
  children?: React.ReactNode;
  className?: string;
  content?: ReactNode;
  description?: string;
  isLoggedIn?: boolean;
  title?: string;
  titleCenter?: boolean;
}

export const SectionWrapper = ({
  children,
  title,
  titleCenter,
  className,
  description,
  isLoggedIn,
  content,
  ...props
}: Props) => {
  const { t } = useLingui();
  const hasHeader = Boolean(title || description || content || props.to);

  return (
    <div className={cn('container space-y-4 py-4 lg:space-y-8 lg:py-8', className)}>
      {hasHeader && (
        <div className={cn(titleCenter ? 'text-center' : 'flex items-center gap-4')}>
          <div className='flex-1 space-y-2'>
            {title && (
              <h2
                className={cn(
                  'text-primary text-xl font-bold md:text-2xl lg:text-3xl',
                  titleCenter && 'text-center'
                )}
              >
                {title}
              </h2>
            )}
            {description && <p className='text-lg'>{description}</p>}
            {content}
          </div>
          <div className='flex justify-end'>
            {props.to && (
              <Link className={cn('!text-xs md:text-base', buttonVariants())} {...props}>
                {t`View all`}
                <ArrowRightIcon />
              </Link>
            )}
          </div>
        </div>
      )}
      {children}
    </div>
  );
};
