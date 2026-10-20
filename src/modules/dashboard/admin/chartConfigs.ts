import { t } from '@lingui/core/macro';

import type { ChartConfig } from '@/shared/ui/chart';

export const getHealthConfig = () =>
  ({
    buyers: { label: t`Buyers`, color: 'var(--chart-1)' },
    users: { label: t`Users`, color: 'var(--chart-1)' }
  }) satisfies ChartConfig;
