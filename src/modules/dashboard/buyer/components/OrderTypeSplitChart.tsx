import { useLingui } from '@lingui/react/macro';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts';

import type { ChartConfig } from '@/shared/ui/chart';

import { getBuyerOrderTypeSplitQueryOptions } from '@/modules/dashboard/buyer';
import { orderTypeColorMap, orderTypeLabelMap } from '@/modules/order';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/ui/chart';

export const OrderTypeSplitChart = () => {
  const { t } = useLingui();
  const data = useSuspenseQuery(getBuyerOrderTypeSplitQueryOptions()).data;
  const chartData = data.map((item) => ({
    fill: orderTypeColorMap[item.type],
    orders: item.count,
    type: item.type
  }));

  const typeConfig = {
    ready: { label: t(orderTypeLabelMap.ready), color: orderTypeColorMap.ready },
    rfq: { label: t(orderTypeLabelMap.rfq), color: orderTypeColorMap.rfq }
  } satisfies ChartConfig;

  return (
    <Card className='rounded-lg'>
      <CardHeader>
        <CardTitle>{t`Order type split`}</CardTitle>
        <CardDescription>{t`Ready-product orders compared with RFQ requests.`}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className='h-72 w-full' config={typeConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey='type'
              tickLine={false}
              tickFormatter={(value: OrderType) => t(orderTypeLabelMap[value])}
            />
            <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
            <ChartTooltip
              content={<ChartTooltipContent hideLabel nameKey='type' />}
              cursor={false}
            />
            <Bar dataKey='orders' radius={[8, 8, 0, 0]}>
              {chartData.map((entry) => (
                <Cell key={entry.type} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
