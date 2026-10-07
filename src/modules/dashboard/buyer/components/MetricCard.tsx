import type { LucideIcon } from 'lucide-react';

import { TrendingUpIcon } from 'lucide-react';

import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

interface Props {
  description: string;
  icon: LucideIcon;
  label: string;
  value: string;
}

export const MetricCard = ({ description, icon: Icon, label, value }: Props) => (
  <Card className='rounded-lg'>
    <CardHeader>
      <CardTitle className='text-muted-foreground flex items-center gap-2 text-sm font-medium'>
        <Icon className='size-4' />
        {label}
      </CardTitle>
      <CardAction>
        <div className='bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg'>
          <TrendingUpIcon className='size-4' />
        </div>
      </CardAction>
    </CardHeader>
    <CardContent>
      <p className='text-2xl font-semibold tabular-nums'>{value}</p>
      <p className='text-muted-foreground mt-2 text-xs'>{description}</p>
    </CardContent>
  </Card>
);
