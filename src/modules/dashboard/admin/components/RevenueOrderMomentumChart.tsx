import { useLingui } from '@lingui/react/macro';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import type { ChartConfig } from '@/shared/ui/chart';

import { getAdminMonthlyRevenueQueryOptions } from '@/modules/dashboard/admin';
import { MONTHS } from '@/shared/constants/month';
import { formatCompactNumber } from '@/shared/lib/format.ts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/ui/chart';
interface MonthlyRevenueChartItem {
  month: string;
  revenue: number;
}

const normalizeMonth = (month: string) => month.trim().toLowerCase();

export const RevenueOrderMomentumChart = () => {
  const { t } = useLingui();

  const { data } = useSuspenseQuery(getAdminMonthlyRevenueQueryOptions()).data;

  const revenueConfig = {
    revenue: { label: t`Revenue`, color: 'var(--chart-1)' }
  } satisfies ChartConfig;

  const revenueByMonth = new Map(data.map((item) => [normalizeMonth(item.month), item]));

  const chartData: MonthlyRevenueChartItem[] = MONTHS.map((month) => {
    const monthLabel = t(month);
    const item = revenueByMonth.get(normalizeMonth(monthLabel));

    return {
      month: monthLabel.substring(0, 3),
      revenue: item ? Number(item.total) : 0
    };
  });

  return (
    <Card className='rounded-lg'>
      <CardHeader>
        <CardTitle>{t`Yearly revenue`}</CardTitle>
        <CardDescription>{t`Total revenue by month for the current year.`}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className='h-100 w-full' config={revenueConfig}>
          <AreaChart
            accessibilityLayer
            margin={{
              left: -20
            }}
            data={chartData}
          >
            <defs>
              <linearGradient id='revenueFill' x1='0' x2='0' y1='0' y2='1'>
                <stop offset='5%' stopColor='var(--color-revenue)' stopOpacity={0.35} />
                <stop offset='95%' stopColor='var(--color-revenue)' stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis axisLine={false} dataKey='month' tickLine={false} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(value: number) => formatCompactNumber(value)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey='revenue'
              fill='url(#revenueFill)'
              type='monotone'
              stroke='var(--color-revenue)'
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
