import { useLingui } from '@lingui/react/macro';

import { Badge } from '@/shared/ui/badge';

export const BuyerDashboardHero = () => {
  const { t } = useLingui();

  return (
    <div className='from-primary/8 to-background rounded-xl border bg-linear-to-r p-4'>
      <div className='flex flex-wrap items-start justify-between gap-4'>
        <div>
          <Badge variant='secondary'>{t`Buyer workspace`}</Badge>
          <h1 className='font-heading mt-3 text-2xl leading-none font-semibold'>
            {t`Buyer dashboard`}
          </h1>
          <p className='text-muted-foreground mt-2 max-w-2xl text-sm'>
            {t`Track your order activity, purchase value and recent buying signals.`}
          </p>
        </div>
      </div>
    </div>
  );
};
