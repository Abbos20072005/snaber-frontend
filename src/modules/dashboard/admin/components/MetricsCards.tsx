import type { TrendingUp } from 'lucide-react';
import type { ComponentProps } from 'react';

import { useLingui } from '@lingui/react/macro';
import { useSuspenseQuery } from '@tanstack/react-query';
import { CircleDollarSign, MessageSquare, ShoppingCart } from 'lucide-react';

import { getAdminLast30DaysStatisticsQueryOptions } from '@/modules/dashboard/admin';
import { formatPrice } from '@/shared/lib/format.ts';
import { cn } from '@/shared/lib/utils.ts';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card.tsx';

type Props = ComponentProps<'div'>;

export const MetricsCards = ({ className, ...props }: Props) => {
  const { t } = useLingui();

  const { orders_count, total_users_count, total_spent } = useSuspenseQuery(
    getAdminLast30DaysStatisticsQueryOptions()
  ).data.data;

  return (
    <div className={cn(className)} {...props}>
      <MetricCard
        label={t`So'm`}
        value={formatPrice(total_spent)}
        description={t`Last 30 days`}
        icon={CircleDollarSign}
      />
      <MetricCard
        label={t`Orders`}
        value={orders_count.toString()}
        description={t`Last 30 days`}
        icon={ShoppingCart}
      />
      <MetricCard
        label={t`Total users`}
        value={total_users_count.toString()}
        description={t`New users in the last 30 days`}
        icon={MessageSquare}
      />
    </div>
  );
};

interface MatricCardProps {
  description: string;
  icon: typeof TrendingUp;
  label: string;
  value: string;
}

const MetricCard = ({ description, icon: Icon, label, value }: MatricCardProps) => (
  <Card className='rounded-lg'>
    <CardHeader>
      <CardTitle className='text-muted-foreground flex items-center gap-2 text-sm font-medium'>
        <Icon className='size-4' />
        {label}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className='text-3xl font-semibold'>{value}</p>
      <p className='text-muted-foreground mt-2 text-sm'>{description}</p>
    </CardContent>
  </Card>
);
