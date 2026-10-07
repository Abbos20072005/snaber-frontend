import type { LucideIcon } from 'lucide-react';

import { useLingui } from '@lingui/react/macro';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ArrowUpRight, CircleDollarSign, Send, ShoppingBag } from 'lucide-react';

import { getSellerKPISQueryOptions } from '@/modules/dashboard/seller';
import { formatPrice } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

interface KpiMeta {
  icon: LucideIcon;
  label: string;
  note: string;
  valueFormatter?: (value: number) => string;
}

const formatDelta = (value: number) => `${value > 0 ? '+' : ''}${value}%`;

const MetricCard = ({
  delta,
  icon: Icon,
  label,
  note,
  value
}: {
  delta: number;
  icon: LucideIcon;
  label: string;
  note: string;
  value: string;
}) => (
  <Card className='rounded-lg'>
    <CardHeader>
      <CardTitle className='text-muted-foreground flex items-center gap-2 text-sm font-medium'>
        <Icon className='size-4' />
        {label}
      </CardTitle>
      <CardAction>
        <Badge className='gap-1' variant='secondary'>
          <ArrowUpRight className='size-3' />
          {formatDelta(delta)}
        </Badge>
      </CardAction>
    </CardHeader>
    <CardContent>
      <p className='text-3xl font-semibold'>{value}</p>
      <p className='text-muted-foreground mt-2 text-sm'>{note}</p>
    </CardContent>
  </Card>
);

export const SellerKpiCards = () => {
  const { t } = useLingui();
  const { data } = useSuspenseQuery(getSellerKPISQueryOptions()).data;

  const kpiMeta: KpiMeta[] = [
    {
      icon: CircleDollarSign,
      label: t`Revenue`,
      note: t`Seller revenue from completed order activity.`,
      valueFormatter: (value) => `${formatPrice(value)} ${t`so'm`}`
    },
    {
      icon: ShoppingBag,
      label: t`Confirmed orders`,
      note: t`Orders confirmed by buyers.`
    },
    {
      icon: Send,
      label: t`Request for Quotation win rate`,
      note: t`Accepted RFQs compared with seller RFQ flow.`,
      valueFormatter: (value) => `${value.toFixed(1)}%`
    }
  ];

  return (
    <div className='grid gap-4 md:grid-cols-1 xl:grid-cols-3'>
      {data.map((item, index) => {
        const meta = kpiMeta[index] ?? kpiMeta[kpiMeta.length - 1];

        return (
          <MetricCard
            key={`${meta.label}-${index}`}
            delta={item.delta}
            label={meta.label}
            value={meta.valueFormatter?.(item.value) ?? formatPrice(item.value)}
            icon={meta.icon}
            note={meta.note}
          />
        );
      })}
    </div>
  );
};
