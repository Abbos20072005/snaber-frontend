import type { ReactNode } from 'react';

import { Card, CardContent } from '@/shared/ui/card';

interface Props {
  label: string;
  value: ReactNode;
}

export const ProductDetailMetricCard = ({ label, value }: Props) => {
  return (
    <Card size='sm'>
      <CardContent className='space-y-1'>
        <div className='text-muted-foreground text-xs'>{label}</div>
        <div className='text-lg font-semibold'>{value}</div>
      </CardContent>
    </Card>
  );
};
