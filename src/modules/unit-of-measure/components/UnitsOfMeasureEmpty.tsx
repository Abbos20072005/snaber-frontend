import { useLingui } from '@lingui/react/macro';
import { RulerIcon } from 'lucide-react';

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/shared/ui/empty';

export const UnitsOfMeasureEmpty = () => {
  const { t } = useLingui();

  return (
    <Empty className='border-border/70 bg-muted/20 py-14'>
      <EmptyHeader>
        <EmptyMedia variant='icon'>
          <RulerIcon className='size-5' />
        </EmptyMedia>
        <EmptyTitle>{t`No units yet`}</EmptyTitle>
        <EmptyDescription>{t`Create a unit of measure to reuse it in product forms.`}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};
