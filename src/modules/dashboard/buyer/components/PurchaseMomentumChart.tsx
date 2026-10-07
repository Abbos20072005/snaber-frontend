import { useLingui } from '@lingui/react/macro';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import type { ChartConfig } from '@/shared/ui/chart';

import { getBuyerPurchaseMomentumQueryOptions } from '@/modules/dashboard/buyer';
import { formatCompactNumber } from '@/shared/lib/format.ts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/ui/chart';

import type { BuyerDashboardMonth } from '../constants';

import { BUYER_DASHBOARD_MONTHS, buyerDashboardMonthLabelMap } from '../constants';

const normalizeMonth = (month: string) => month.toLowerCase().slice(0, 3) as BuyerDashboardMonth;

export const PurchaseMomentumChart = () => {
  const { t } = useLingui();
  const data = useSuspenseQuery(getBuyerPurchaseMomentumQueryOptions()).data;
  const momentumByMonth = new Map(data.map((item) => [normalizeMonth(item.month), item]));
  const chartData = BUYER_DASHBOARD_MONTHS.map((month) => {
    const item = momentumByMonth.get(month);

    return {
      month: t(buyerDashboardMonthLabelMap[month]),
      orders: item?.orders ?? 0,
      spend: item?.spend ?? 0
    };
  });

  const trendConfig = {
    orders: { label: t`Orders`, color: 'var(--chart-1)' },
    spend: { label: t`Spend`, color: 'var(--chart-2)' }
  } satisfies ChartConfig;

  return (
    <Card className='rounded-lg'>
      <CardHeader>
        <CardTitle>{t`Purchase momentum`}</CardTitle>
        <CardDescription>{t`Order volume and estimated spend over the last six months.`}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className='h-113 w-full' config={trendConfig}>
          <AreaChart accessibilityLayer data={chartData} margin={{ left: -20 }}>
            <defs>
              <linearGradient id='buyerSpendFill' x1='0' x2='0' y1='0' y2='1'>
                <stop offset='5%' stopColor='var(--color-spend)' stopOpacity={0.3} />
                <stop offset='95%' stopColor='var(--color-spend)' stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis axisLine={false} dataKey='month' tickLine={false} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => formatCompactNumber(value)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey='spend'
              fill='url(#buyerSpendFill)'
              type='monotone'
              stroke='var(--color-spend)'
              strokeWidth={2}
            />
            <Area
              dataKey='orders'
              fill='transparent'
              type='monotone'
              stroke='var(--color-orders)'
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
