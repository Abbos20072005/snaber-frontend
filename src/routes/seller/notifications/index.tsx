import { createFileRoute } from '@tanstack/react-router';

import { NotificationList } from '@/modules/notifications';
import { PageContent } from '@/shared/ui/page';

const SellerNotificationPage = () => (
  <PageContent className='mx-auto w-full max-w-5xl space-y-4'>
    <NotificationList className='space-y-4' />
  </PageContent>
);

export const Route = createFileRoute('/seller/notifications/')({
  component: SellerNotificationPage
});
