import { CogIcon } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

interface SiteLogoProps {
  className?: string;
  dark?: boolean;
}

export const SiteLogo = ({ className, dark }: SiteLogoProps) => (
  <span className={cn('flex items-center gap-2', className)}>
    <span className='flex size-9 items-center justify-center rounded-md bg-yellow-400'>
      <CogIcon className='size-6 text-black' strokeWidth={2.5} />
    </span>
    <span
      className={cn(
        'text-[22px] leading-none font-extrabold tracking-tight',
        dark ? 'text-white' : 'text-black'
      )}
    >
      SNABER
      <span className='text-yellow-400'>.</span>
      <span className={cn('text-sm font-bold', dark ? 'text-white/80' : 'text-black/70')}>uz</span>
    </span>
  </span>
);
