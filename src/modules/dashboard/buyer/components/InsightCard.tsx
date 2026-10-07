import type { LucideIcon } from 'lucide-react';

import { Card, CardContent } from '@/shared/ui/card';

interface Props {
  description: string;
  icon: LucideIcon;
  label: string;
  value: string;
}

export const InsightCard = ({ description, icon: Icon, label, value }: Props) => (
  <Card className='rounded-lg'>
    <CardContent className='flex items-start gap-3 p-4'>
      <div className='bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg'>
        <Icon className='size-4' />
      </div>
      <div className='min-w-0'>
        <p className='text-sm font-medium'>{label}</p>
        <p className='mt-1 text-2xl font-semibold'>{value}</p>
        <p className='text-muted-foreground mt-1 text-xs'>{description}</p>
      </div>
    </CardContent>
  </Card>
);
