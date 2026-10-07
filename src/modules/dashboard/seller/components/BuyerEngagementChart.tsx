import { useLingui } from '@lingui/react/macro';
import { useSuspenseQuery } from '@tanstack/react-query';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

import { getSellerBuyerEngagementQueryOptions } from '@/modules/dashboard/seller';
import { weekDaysLabelMap, weekDaysLabelOptions } from '@/shared/constants/week-day';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/ui/chart';

import { getActivityConfig } from '../charConfigs';

const getBuyerEngagementData = (data: BuyerEngagement) => {
  const engagementByDay = new Map(data.map((item) => [item.day, item]));

  return weekDaysLabelOptions.map((day) => {
    const item = engagementByDay.get(day.value);

    return {
      day: day.value,
      chats: item?.chats ?? 0,
      views: item?.views ?? 0
    };
  });
};

export const BuyerEngagementChart = () => {
  const { t } = useLingui();

  const { data } = useSuspenseQuery(getSellerBuyerEngagementQueryOptions()).data;

  const chartData = getBuyerEngagementData(data);

  return (
    <Card className='rounded-lg xl:col-span-2'>
      <CardHeader>
        <CardTitle>{t`Buyer engagement`}</CardTitle>
        <CardDescription>{t`Product views compared with buyer chat starts.`}</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer className='h-75 w-full' config={getActivityConfig()}>
          <LineChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />

            <XAxis
              axisLine={false}
              dataKey='day'
              tickLine={false}
              tickFormatter={(value: WeekDay) => t(weekDaysLabelMap[value])}
            />

            <YAxis axisLine={false} tickLine={false} />

            <ChartTooltip content={<ChartTooltipContent />} />

            <Line
              dataKey='views'
              type='monotone'
              dot={false}
              stroke='var(--color-views)'
              strokeWidth={2}
            />

            <Line
              dataKey='chats'
              type='monotone'
              dot={false}
              stroke='var(--color-chats)'
              strokeWidth={2}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
