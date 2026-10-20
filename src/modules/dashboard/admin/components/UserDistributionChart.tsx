import { useLingui } from '@lingui/react/macro';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Cell, Label, Pie, PieChart } from 'recharts';

import type { ChartConfig } from '@/shared/ui/chart';

import { getAdminUserCountsQueryOptions } from '@/modules/dashboard/admin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/ui/chart';

interface UserDistributionChartItem {
  fill: string;
  segment: string;
  value: number;
}

const getPercentage = (value: number, total: number) => {
  if (!total) return 0;

  return Math.round((value / total) * 100);
};

export const UserDistributionChart = () => {
  const { t } = useLingui();

  const { buyers, admins, total_users } = useSuspenseQuery(getAdminUserCountsQueryOptions()).data
    .data;
  const totalUsers = total_users || buyers + admins;
  const buyersPercentage = getPercentage(buyers, totalUsers);
  const adminsPercentage = getPercentage(admins, totalUsers);

  const chartData: UserDistributionChartItem[] = [
    {
      fill: 'var(--color-buyers)',
      segment: t`Clients`,
      value: buyers
    },
    {
      fill: 'var(--color-admins)',
      segment: t`Admins`,
      value: admins
    }
  ];

  const healthConfig = {
    buyers: { label: t`Clients`, color: 'var(--chart-1)' },
    admins: { label: t`Admins`, color: 'var(--chart-2)' },
    users: { label: t`Users`, color: 'var(--chart-1)' }
  } satisfies ChartConfig;

  return (
    <Card className='rounded-lg'>
      <CardHeader>
        <CardTitle>{t`User distribution`}</CardTitle>
        <CardDescription>{t`Clients and admins among all users.`}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className='mx-auto h-65 w-full' config={healthConfig}>
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey='value'
              innerRadius={74}
              nameKey='segment'
              paddingAngle={3}
              outerRadius={112}
            >
              {chartData.map((entry) => (
                <Cell key={entry.segment} fill={entry.fill} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (!viewBox || !('cx' in viewBox) || !('cy' in viewBox)) return null;

                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      dominantBaseline='middle'
                      textAnchor='middle'
                    >
                      <tspan className='fill-foreground text-2xl font-semibold'>{totalUsers}</tspan>
                      <tspan className='fill-muted-foreground text-xs' dy={20} x={viewBox.cx}>
                        {t`Total users`}
                      </tspan>
                    </text>
                  );
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className='grid gap-3'>
          <QualityRow label={t`Clients`} value={`${buyersPercentage}% (${buyers})`} />
          <QualityRow label={t`Admins`} value={`${adminsPercentage}% (${admins})`} />
          <QualityRow label={t`Total users`} value={totalUsers.toString()} />
        </div>
      </CardContent>
    </Card>
  );
};

const QualityRow = ({ label, value }: { label: string; value: string }) => (
  <div className='flex items-center justify-between rounded-lg border px-3 py-2'>
    <span className='text-muted-foreground text-sm'>{label}</span>
    <span className='font-medium'>{value}</span>
  </div>
);
