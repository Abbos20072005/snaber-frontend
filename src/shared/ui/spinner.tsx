import { useLingui } from '@lingui/react/macro';
import { Loader2Icon } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

const Spinner = ({ className, ...props }: React.ComponentProps<'svg'>) => {
  const { t } = useLingui();

  return (
    <Loader2Icon
      aria-label={t`Loading`}
      className={cn('animate-spin', className)}
      role='status'
      {...props}
    />
  );
};

export { Spinner };
