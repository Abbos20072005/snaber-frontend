import { useLingui } from '@lingui/react/macro';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeftIcon, BellIcon } from 'lucide-react';

import { NotificationList } from '@/modules/notifications';
import { GeneralError, NotFoundError } from '@/shared/ui/errors';
import { PageLoading } from '@/shared/ui/page';
import { SectionWrapper } from '@/shared/ui/section-wrapper';

const NotificationPage = () => {
  const { t } = useLingui();
  return (
    <>
      <SectionWrapper
        className='md:hidden'
        content={
          <>
            <h2 className='text-primary flex items-center gap-1.5 text-xl font-bold'>
              <Link className='flex items-center gap-1 text-xs md:text-base' to='/profile'>
                <ArrowLeftIcon className='size-4' />
              </Link>
              <BellIcon className='size-5' />
              {t`Notifications`}
            </h2>
          </>
        }
      >
        <NotificationList className='space-y-3' />
      </SectionWrapper>
      <div className='hidden md:block'>
        <NotificationList className='space-y-3' />
      </div>
    </>
  );
};

export const Route = createFileRoute('/(main)/profile/notifications')({
  component: NotificationPage,
  pendingComponent: PageLoading,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError
});
