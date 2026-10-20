import { useLingui } from '@lingui/react/macro';
import { useSuspenseQuery } from '@tanstack/react-query';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

import type { ChartConfig } from '@/shared/ui/chart';

import { getAdminWeeklyJoinedUsersQueryOptions } from '@/modules/dashboard/admin';
import { weekDaysLabelOptions } from '@/shared/constants/week-day';
import { formatCompactNumber } from '@/shared/lib/format.ts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/ui/chart';

interface WeeklyJoinedUsersChartItem {
  day: string;
  users: number;
}

const normalizeDay = (day: string) => day.trim().slice(0, 3).toLowerCase();

export const WeeklyJoinedUsersChart = () => {
  const { t } = useLingui();

  const { data } = useSuspenseQuery(getAdminWeeklyJoinedUsersQueryOptions()).data;

  const joinedUsersByDay = new Map(data.map((item) => [normalizeDay(item.day), item.count]));

  const healthConfig = {
    buyers: { label: t`Buyers`, color: 'var(--chart-1)' },
    users: { label: t`Users`, color: 'var(--chart-1)' }
  } satisfies ChartConfig;

  const chartData: WeeklyJoinedUsersChartItem[] = weekDaysLabelOptions.map((day) => {
    const dayLabel = t(day.label);

    return {
      day: dayLabel.substring(0, 3),
      users: joinedUsersByDay.get(normalizeDay(dayLabel)) ?? 0
    };
  });

  return (
    <Card className='rounded-lg'>
      <CardHeader>
        <CardTitle>{t`Weekly joined users`}</CardTitle>
        <CardDescription>{t`New user registrations by weekday.`}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className='h-75 w-full' config={healthConfig}>
          <LineChart
            accessibilityLayer
            margin={{
              left: -20,
              top: 20
            }}
            data={chartData}
          >
            <CartesianGrid vertical={false} />
            <XAxis axisLine={false} dataKey='day' tickLine={false} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(value: number) => formatCompactNumber(value)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line dataKey='users' type='monotone' dot stroke='var(--color-users)' strokeWidth={2} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
