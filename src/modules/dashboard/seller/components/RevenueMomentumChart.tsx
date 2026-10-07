import { useLingui } from '@lingui/react/macro';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Area, AreaChart, CartesianGrid, Line, XAxis, YAxis } from 'recharts';

import type { MonthKey } from '@/shared/constants/month.ts';

import { getSellerRevenueMomentumQueryOptions } from '@/modules/dashboard/seller';
import { monthKeyMap } from '@/shared/constants/month.ts';
import { formatCompactNumber } from '@/shared/lib/format';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/ui/chart';

import { getRevenueConfig } from '../charConfigs';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const getRevenueMomentumData = (data: RevenueMomentum) => {
  const revenueByMonth = new Map(data.map((item) => [item.month, item]));

  return MONTHS.map((month) => {
    const item = revenueByMonth.get(month);

    return {
      month,
      orders: item?.orders ?? 0,
      quotes: item?.quotes ?? 0,
      revenue: item?.revenue ?? 0
    };
  });
};

export const RevenueMomentumChart = () => {
  const { t } = useLingui();
  const { data } = useSuspenseQuery(getSellerRevenueMomentumQueryOptions()).data;
  const chartData = getRevenueMomentumData(data);

  return (
    <Card className='rounded-lg'>
      <CardHeader>
        <CardTitle>{t`Revenue momentum`}</CardTitle>
        <CardDescription>{t`Monthly revenue, order count and quote volume.`}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className='h-85 w-full' config={getRevenueConfig()}>
          <AreaChart accessibilityLayer data={chartData}>
            <defs>
              <linearGradient id='sellerRevenue' x1='0' x2='0' y1='0' y2='1'>
                <stop offset='5%' stopColor='var(--color-revenue)' stopOpacity={0.32} />
                <stop offset='95%' stopColor='var(--color-revenue)' stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey='month'
              tickLine={false}
              tickFormatter={(val: MonthKey) => t(monthKeyMap[val]).substring(0, 3)}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => formatCompactNumber(value)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey='revenue'
              fill='url(#sellerRevenue)'
              type='monotone'
              stroke='var(--color-revenue)'
              strokeWidth={2}
            />
            <Line
              dataKey='orders'
              type='monotone'
              dot={false}
              stroke='var(--color-orders)'
              strokeWidth={2}
            />
            <Line
              dataKey='quotes'
              type='monotone'
              dot={false}
              stroke='var(--color-quotes)'
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
