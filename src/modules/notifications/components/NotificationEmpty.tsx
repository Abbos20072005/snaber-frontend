import { useLingui } from '@lingui/react/macro';
import { BellRingIcon } from 'lucide-react';

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/shared/ui/empty';

export const NotificationEmpty = () => {
  const { t } = useLingui();

  return (
    <Empty className='border-border/70 bg-muted/20 py-14'>
      <EmptyHeader>
        <EmptyMedia variant='icon'>
          <BellRingIcon className='size-5' />
        </EmptyMedia>
        <EmptyTitle>{t`No messages found`}</EmptyTitle>
        <EmptyDescription>
          {t`Try adjusting your search or switch tabs to browse other notifications.`}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};
