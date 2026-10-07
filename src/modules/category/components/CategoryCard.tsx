import { useLingui } from '@lingui/react/macro';

import { cn } from '@/shared/lib/utils';
import { Card, CardHeader, CardTitle } from '@/shared/ui/card';

interface Props {
  category: Category;
  compact?: boolean;
}

export const CategoryCard = ({ category, compact }: Props) => {
  const { t } = useLingui();

  return (
    <Card className='border-primary h-full' size='sm'>
      <img alt={t`Category`} className='aspect-video w-full object-cover' src={category.image} />
      <CardHeader className={cn(compact && 'p-2')}>
        <CardTitle className={cn('text-primary text-center', compact ? 'text-sm!' : 'text-lg!')}>
          {category.name}
        </CardTitle>
      </CardHeader>
    </Card>
  );
};
