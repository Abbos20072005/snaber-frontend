import { useLingui } from '@lingui/react/macro';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Cell, Pie, PieChart } from 'recharts';

import { getSellerSalesByCategoryQueryOptions } from '@/modules/dashboard/seller';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/ui/chart';

import { getCategoryConfig } from '../charConfigs';

const CATEGORY_COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)'];

export const SalesByCategoryChart = () => {
  const { t } = useLingui();
  const { data } = useSuspenseQuery(getSellerSalesByCategoryQueryOptions()).data;

  const chartData = data.map((category, index) => ({
    category: category.category_name,
    fill: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
    value: category.orders_count
  }));

  return (
    <Card className='rounded-lg'>
      <CardHeader>
        <CardTitle>{t`Sales by category`}</CardTitle>
        <CardDescription>{t`Where current buyer demand comes from.`}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className='h-65 w-full' config={getCategoryConfig()}>
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey='value' innerRadius={58} nameKey='category'>
              {chartData.map((entry) => (
                <Cell key={entry.category} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className='mt-4 space-y-2'>
          {chartData.map((entry) => (
            <div key={entry.category} className='flex items-center justify-between gap-3 text-sm'>
              <div className='flex items-center gap-2'>
                <span className='size-2 rounded-full' style={{ backgroundColor: entry.fill }} />
                <span>{entry.category}</span>
              </div>
              <span className='font-medium tabular-nums'>{entry.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
