import { useLingui } from '@lingui/react/macro';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { getSellerRFQPipelineQueryOptions } from '@/modules/dashboard/seller';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/ui/chart';

import { getPipelineConfig } from '../charConfigs';

export const RfqPipelineChart = () => {
  const { t } = useLingui();
  const { data } = useSuspenseQuery(getSellerRFQPipelineQueryOptions()).data;

  const chartData = [
    { stage: t`New`, value: data.new },
    { stage: t`Pending`, value: data.pending },
    { stage: t`Negotiation`, value: data.negotiation },
    { stage: t`Accepted`, value: data.accepted },
    { stage: t`Rejected`, value: data.rejected },
    { stage: t`Closed`, value: data.closed }
  ];

  return (
    <Card className='rounded-lg'>
      <CardHeader>
        <CardTitle>{t`Request for Quotation pipeline`}</CardTitle>
        <CardDescription>{t`Requests moving through your sales flow.`}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className='h-75 w-full' config={getPipelineConfig()}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis axisLine={false} dataKey='stage' tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey='value' fill='var(--color-value)' radius={[8, 8, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
