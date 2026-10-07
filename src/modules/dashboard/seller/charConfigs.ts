import { t } from '@lingui/core/macro';

import type { ChartConfig } from '@/shared/ui/chart';

export const getRevenueConfig = () =>
  ({
    revenue: { label: t`Revenue`, color: 'var(--chart-1)' },
    orders: { label: t`Orders`, color: 'var(--chart-2)' },
    quotes: { label: t`Quotes`, color: 'var(--chart-3)' }
  }) satisfies ChartConfig;

export const getActivityConfig = () =>
  ({
    views: { label: t`Product views`, color: 'var(--chart-1)' },
    chats: { label: t`Chats`, color: 'var(--chart-2)' }
  }) satisfies ChartConfig;

export const getCategoryConfig = () =>
  ({
    packaging: { label: t`Packaging`, color: 'var(--chart-1)' },
    textiles: { label: t`Textiles`, color: 'var(--chart-2)' },
    electronics: { label: t`Electronics`, color: 'var(--chart-3)' },
    office: { label: t`Office supply`, color: 'var(--chart-4)' }
  }) satisfies ChartConfig;

export const getPipelineConfig = () =>
  ({
    value: { label: t`RFQs`, color: 'var(--chart-1)' }
  }) satisfies ChartConfig;
