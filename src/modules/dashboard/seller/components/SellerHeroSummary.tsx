import type { LucideIcon } from 'lucide-react';

import { useLingui } from '@lingui/react/macro';
import { useSuspenseQuery } from '@tanstack/react-query';
import { MessageSquareText, TrendingUp, Truck } from 'lucide-react';

import { getSellerHeroSummaryQueryOptions } from '@/modules/dashboard/seller';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent } from '@/shared/ui/card';

const formatPercent = (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;

const HeroSignal = ({
  icon: Icon,
  label,
  value
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) => (
  <div className='flex items-center gap-3'>
    <div className='bg-primary-foreground/15 flex size-9 items-center justify-center rounded-lg'>
      <Icon className='size-4' />
    </div>
    <div className='min-w-0 flex-1'>
      <p className='text-primary-foreground/70 truncate text-sm'>{label}</p>
      <p className='font-semibold'>{value}</p>
    </div>
  </div>
);

export const SellerHeroSummary = () => {
  const { t } = useLingui();
  const { dispatch_due_today, monthly_growth, unread_buyer_chats } = useSuspenseQuery(
    getSellerHeroSummaryQueryOptions()
  ).data.data;

  return (
    <Card className='border-primary/20 bg-primary text-primary-foreground rounded-lg xl:col-span-2'>
      <CardContent className='grid gap-6 p-6 lg:grid-cols-[1fr_auto] lg:items-center'>
        <div>
          <div className='mb-4 flex flex-wrap items-center gap-2'>
            <Badge className='bg-primary-foreground/15 text-primary-foreground' variant='secondary'>
              {t`Workspace`}
            </Badge>
          </div>
          <h1 className='max-w-3xl text-3xl leading-tight font-semibold'>
            {t`Track quotes, buyer chats and dispatch pressure from one seller dashboard.`}
          </h1>
          <p className='text-primary-foreground/75 mt-3 max-w-2xl text-sm'>
            {t`Monitor revenue momentum, category demand, RFQ pipeline and recent order activity using seller APIs.`}
          </p>
        </div>
        <div className='bg-primary-foreground/10 grid min-w-72 gap-3 rounded-lg p-4'>
          <HeroSignal
            label={t`Monthly growth`}
            value={formatPercent(monthly_growth)}
            icon={TrendingUp}
          />
          <HeroSignal
            label={t`Unread buyer chats`}
            value={String(unread_buyer_chats)}
            icon={MessageSquareText}
          />
          <HeroSignal
            label={t`Dispatch due today`}
            value={String(dispatch_due_today)}
            icon={Truck}
          />
        </div>
      </CardContent>
    </Card>
  );
};
