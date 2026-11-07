import { useLingui } from '@lingui/react/macro';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Cell, Pie, PieChart } from 'recharts';

import type { ChartConfig } from '@/shared/ui/chart';

import { getAdminOrdersByCategoryQueryOptions } from '@/modules/dashboard/admin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/ui/chart';

interface CategoryDemandChartItem {
  category: string;
  fill: string;
  value: number;
}

const CATEGORY_COLORS = [
  'var(--color-category1)',
  'var(--color-category2)',
  'var(--color-category3)',
  'var(--color-others)'
] as const;

// The API already sends the top categories plus one "Others" row that sums up the rest.
const OTHERS_KEY = 'Others';

const getCategoryDemandData = (
  categories: AdminOrdersByCategoryItem[],
  othersLabel: string
): CategoryDemandChartItem[] => {
  const named = categories.filter((category) => category.category_name !== OTHERS_KEY);
  const others = categories.find((category) => category.category_name === OTHERS_KEY);

  const chartData = named.map((category, index) => ({
    category: category.category_name,
    fill: CATEGORY_COLORS[index],
    value: category.orders_count
  }));

  if (others) {
    chartData.push({
      category: othersLabel,
      fill: CATEGORY_COLORS[3],
      value: others.orders_count
    });
  }

  return chartData;
};

export const CategoryDemandChart = () => {
  const { t } = useLingui();

  const { data } = useSuspenseQuery(getAdminOrdersByCategoryQueryOptions()).data;
  const chartData = getCategoryDemandData(data, t`Others`);
  const totalOrders = chartData.reduce((total, category) => total + category.value, 0);

  const categoryConfig = {
    category1: { label: t`Category 1`, color: 'var(--chart-1)' },
    category2: { label: t`Category 2`, color: 'var(--chart-2)' },
    category3: { label: t`Category 3`, color: 'var(--chart-3)' },
    others: { label: t`Others`, color: 'var(--chart-4)' }
  } satisfies ChartConfig;

  return (
    <Card className='rounded-lg'>
      <CardHeader>
        <CardTitle>{t`Category demand`}</CardTitle>
        <CardDescription>{t`Share of marketplace activity.`}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className='h-60 w-full' config={categoryConfig}>
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey='value' innerRadius={58} nameKey='category'>
              {chartData.map((entry) => (
                <Cell key={entry.category} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className='mt-4 grid gap-3'>
          {chartData.map((entry) => (
            <div key={entry.category} className='rounded-lg border px-3 py-2.5'>
              <div className='flex items-center justify-between gap-3'>
                <div className='flex min-w-0 items-center gap-2'>
                  <span className='truncate text-sm font-medium'>{entry.category}</span>
                </div>
                <div className='flex shrink-0 items-center gap-2 text-sm'>
                  <span className='font-semibold tabular-nums'>{entry.value}</span>
                  <span className='text-muted-foreground tabular-nums'>
                    {totalOrders ? Math.round((entry.value / totalOrders) * 100) : 0}%
                  </span>
                </div>
              </div>
              <div className='bg-muted mt-2 h-1.5 overflow-hidden rounded-full'>
                <div
                  style={{
                    backgroundColor: entry.fill,
                    width: `${totalOrders ? (entry.value / totalOrders) * 100 : 0}%`
                  }}
                  className='h-full rounded-full'
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
