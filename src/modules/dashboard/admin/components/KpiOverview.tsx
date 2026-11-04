import type { LucideIcon } from 'lucide-react';

import { useLingui } from '@lingui/react/macro';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  BanknoteIcon,
  CircleDollarSignIcon,
  MinusIcon,
  PackageIcon,
  ReceiptTextIcon,
  RepeatIcon,
  ShoppingCartIcon,
  UserPlusIcon,
  UsersIcon
} from 'lucide-react';
import { useState } from 'react';
import { Area, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from 'recharts';

import type { ChartConfig } from '@/shared/ui/chart';

import { getAdminOverviewQueryOptions } from '@/modules/dashboard/admin';
import { formatCompactNumber, formatLocaleDate, formatPrice } from '@/shared/lib/format';
import { cn } from '@/shared/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/ui/chart';
import { Skeleton } from '@/shared/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs';

const PERIODS: AdminOverviewPeriod[] = ['7d', '30d', '90d', '365d'];

// Change in percent, null when there is nothing to compare with.
const getChange = (current: number, previous: number) => {
  if (previous === 0) return current === 0 ? 0 : null;
  return ((current - previous) / previous) * 100;
};

const Delta = ({ current, previous }: { current: number; previous: number }) => {
  const { t } = useLingui();
  const change = getChange(current, previous);

  if (change === null) {
    return (
      <span className='inline-flex items-center gap-1 text-xs font-medium text-sky-600'>
        <ArrowUpRightIcon className='size-3.5' />
        {t`New`}
      </span>
    );
  }

  const rounded = Math.round(change * 10) / 10;
  const Icon = rounded > 0 ? ArrowUpRightIcon : rounded < 0 ? ArrowDownRightIcon : MinusIcon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-xs font-medium',
        rounded > 0 && 'text-emerald-600',
        rounded < 0 && 'text-red-600',
        rounded === 0 && 'text-muted-foreground'
      )}
    >
      <Icon className='size-3.5' />
      {rounded > 0 ? '+' : ''}
      {rounded}%
    </span>
  );
};

interface KpiCardProps {
  current: number;
  hint?: string;
  icon: LucideIcon;
  label: string;
  previous: number;
  format?: (value: number) => string;
}

const KpiCard = ({ current, format, hint, icon: Icon, label, previous }: KpiCardProps) => {
  const { t } = useLingui();
  const display = format ?? ((value: number) => value.toString());
  const previousDisplay = display(previous);

  return (
    <Card className='rounded-lg'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-muted-foreground flex items-center gap-2 text-sm font-medium'>
          <Icon className='size-4' />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-1'>
        <p className='text-2xl font-semibold'>{display(current)}</p>
        <div className='flex flex-wrap items-center gap-x-2 text-xs'>
          <Delta current={current} previous={previous} />
          <span className='text-muted-foreground'>{t`before: ${previousDisplay}`}</span>
        </div>
        {hint && <p className='text-muted-foreground text-xs'>{hint}</p>}
      </CardContent>
    </Card>
  );
};

export const KpiOverview = () => {
  const { t } = useLingui();
  const [period, setPeriod] = useState<AdminOverviewPeriod>('30d');
  const { data: response, isPending } = useQuery(getAdminOverviewQueryOptions(period));

  const periodLabels: Record<AdminOverviewPeriod, string> = {
    '7d': t`7 days`,
    '30d': t`30 days`,
    '90d': t`90 days`,
    '365d': t`1 year`
  };

  const overview = response?.data;

  const chartConfig = {
    revenue: { label: t`Revenue`, color: 'var(--chart-1)' },
    orders_count: { label: t`Orders`, color: 'var(--chart-2)' }
  } satisfies ChartConfig;

  const money = (value: number) => formatPrice(Math.round(value));
  const days = overview?.days ?? 0;
  const compare = overview
    ? t`Compared with the previous ${days} days`
    : t`Compared with the previous period`;

  const repeatRate = (kpis: AdminKpis) =>
    kpis.active_buyers ? Math.round((kpis.returning_buyers / kpis.active_buyers) * 100) : 0;

  return (
    <section className='space-y-4'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div>
          <h2 className='text-lg font-semibold'>{t`Key indicators`}</h2>
          <p className='text-muted-foreground text-sm'>
            {compare}
            {overview &&
              ` · ${formatLocaleDate(overview.start, 'd MMM')} – ${formatLocaleDate(overview.end, 'd MMM')}`}
          </p>
        </div>
        <Tabs value={period} onValueChange={(value) => setPeriod(value as AdminOverviewPeriod)}>
          <TabsList>
            {PERIODS.map((item) => (
              <TabsTrigger key={item} value={item}>
                {periodLabels[item]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {isPending || !overview ? (
        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className='h-28 rounded-lg' />
          ))}
        </div>
      ) : (
        <>
          <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
            <KpiCard
              current={Number(overview.current.revenue)}
              label={t`Revenue (so'm)`}
              format={money}
              icon={CircleDollarSignIcon}
              previous={Number(overview.previous.revenue)}
            />
            <KpiCard
              current={overview.current.orders_count}
              label={t`Orders`}
              icon={ShoppingCartIcon}
              previous={overview.previous.orders_count}
            />
            <KpiCard
              current={Number(overview.current.average_order_value)}
              hint={t`Revenue divided by the number of orders`}
              label={t`Average order value`}
              format={money}
              icon={ReceiptTextIcon}
              previous={Number(overview.previous.average_order_value)}
            />
            <KpiCard
              current={overview.current.units_sold}
              label={t`Items sold`}
              icon={PackageIcon}
              previous={overview.previous.units_sold}
            />
            <KpiCard
              current={overview.current.active_buyers}
              hint={t`Customers who placed an order`}
              label={t`Active buyers`}
              icon={UsersIcon}
              previous={overview.previous.active_buyers}
            />
            <KpiCard
              current={repeatRate(overview.current)}
              hint={t`Share of buyers who had ordered before`}
              label={t`Returning buyers`}
              format={(value) => `${value}%`}
              icon={RepeatIcon}
              previous={repeatRate(overview.previous)}
            />
            <KpiCard
              current={overview.current.new_users}
              label={t`New users`}
              icon={UserPlusIcon}
              previous={overview.previous.new_users}
            />
            <KpiCard
              current={Number(overview.current.revenue) / overview.days}
              hint={t`Average revenue per day`}
              label={t`Revenue per day`}
              format={money}
              icon={BanknoteIcon}
              previous={Number(overview.previous.revenue) / overview.days}
            />
          </div>

          <Card className='rounded-lg'>
            <CardHeader>
              <CardTitle>{t`Revenue and orders by day`}</CardTitle>
              <CardDescription>{t`Daily figures for the selected period.`}</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer className='h-72 w-full' config={chartConfig}>
                <ComposedChart accessibilityLayer data={overview.daily} margin={{ left: -10 }}>
                  <defs>
                    <linearGradient id='kpiRevenueFill' x1='0' x2='0' y1='0' y2='1'>
                      <stop offset='5%' stopColor='var(--color-revenue)' stopOpacity={0.35} />
                      <stop offset='95%' stopColor='var(--color-revenue)' stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    axisLine={false}
                    dataKey='date'
                    minTickGap={24}
                    tickLine={false}
                    tickFormatter={(value: string) => formatLocaleDate(value, 'd MMM')}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    yAxisId='revenue'
                    tickFormatter={(value: number) => formatCompactNumber(value)}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    yAxisId='orders'
                    allowDecimals={false}
                    orientation='right'
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value) => formatLocaleDate(String(value), 'd MMMM yyyy')}
                      />
                    }
                  />
                  <Area
                    dataKey={(point: AdminDailyPoint) => Number(point.revenue)}
                    fill='url(#kpiRevenueFill)'
                    name='revenue'
                    type='monotone'
                    yAxisId='revenue'
                    stroke='var(--color-revenue)'
                    strokeWidth={2}
                  />
                  <Line
                    dataKey='orders_count'
                    type='monotone'
                    yAxisId='orders'
                    dot={false}
                    stroke='var(--color-orders_count)'
                    strokeWidth={2}
                  />
                </ComposedChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </>
      )}
    </section>
  );
};
