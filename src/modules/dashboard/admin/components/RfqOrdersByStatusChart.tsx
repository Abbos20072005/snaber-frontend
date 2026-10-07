import { useLingui } from '@lingui/react/macro';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import type { ChartConfig } from '@/shared/ui/chart';

import { getAdminRFQOrdersByStatusQueryOptions } from '@/modules/dashboard/admin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/ui/chart';

interface RfqStatusChartItem {
  rfqs: number;
  stage: string;
}

export const RfqOrdersByStatusChart = () => {
  const { t } = useLingui();

  const { data } = useSuspenseQuery(getAdminRFQOrdersByStatusQueryOptions()).data;

  const chartData: RfqStatusChartItem[] = [
    { stage: t`New`, rfqs: data.new },
    { stage: t`Pending`, rfqs: data.pending },
    { stage: t`Negotiation`, rfqs: data.negotiation },
    { stage: t`Accepted`, rfqs: data.accepted },
    { stage: t`Rejected`, rfqs: data.rejected },
    { stage: t`Closed`, rfqs: data.closed }
  ];

  const revenueConfig = {
    revenue: { label: t`Revenue`, color: 'var(--chart-1)' },
    orders: { label: t`Orders`, color: 'var(--chart-2)' },
    rfqs: { label: t`RFQs`, color: 'var(--chart-3)' }
  } satisfies ChartConfig;

  return (
    <Card className='rounded-lg xl:col-span-2'>
      <CardHeader>
        <CardTitle>{t`RFQ orders by status`}</CardTitle>
        <CardDescription>{t`Current RFQ order distribution across workflow statuses.`}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className='h-95 w-full' config={revenueConfig}>
          <BarChart
            accessibilityLayer
            margin={{
              left: -20
            }}
            data={chartData}
          >
            <CartesianGrid vertical={false} />
            <XAxis axisLine={false} dataKey='stage' tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey='rfqs' fill='var(--color-rfqs)' radius={[8, 8, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
