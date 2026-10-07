import { useLingui } from '@lingui/react/macro';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Cell, Pie, PieChart } from 'recharts';

import type { ChartConfig } from '@/shared/ui/chart';

import { getBuyerStatusMixQueryOptions } from '@/modules/dashboard/buyer';
import { orderStatusColorMap, orderStatusLabelMap } from '@/modules/order';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/ui/chart';

import { ORDER_STATUSES } from '../constants';

export const OrderStatusMixChart = () => {
  const { t } = useLingui();
  const data = useSuspenseQuery(getBuyerStatusMixQueryOptions()).data;
  const chartData = data.map((item) => ({
    fill: orderStatusColorMap[item.status],
    status: item.status,
    value: item.count
  }));

  const statusConfig = ORDER_STATUSES.reduce<ChartConfig>((config, status) => {
    config[status] = {
      label: t(orderStatusLabelMap[status]),
      color: orderStatusColorMap[status]
    };
    return config;
  }, {});

  return (
    <Card className='rounded-lg'>
      <CardHeader>
        <CardTitle>{t`Order status mix`}</CardTitle>
        <CardDescription>{t`Current distribution across buyer order statuses.`}</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <ChartContainer className='mx-auto h-64 w-full' config={statusConfig}>
          <PieChart accessibilityLayer>
            <ChartTooltip content={<ChartTooltipContent hideLabel nameKey='status' />} />
            <Pie
              data={chartData}
              dataKey='value'
              innerRadius={54}
              nameKey='status'
              outerRadius={86}
            >
              {chartData.map((entry) => (
                <Cell key={entry.status} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>

        <div className='space-y-2'>
          {chartData.map((item) => (
            <div key={item.status} className='flex items-center justify-between gap-3 text-sm'>
              <div className='flex items-center gap-2'>
                <span className='size-2 rounded-full' style={{ backgroundColor: item.fill }} />
                <span>{t(orderStatusLabelMap[item.status])}</span>
              </div>
              <span className='font-medium tabular-nums'>{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
