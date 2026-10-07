import { createFileRoute } from '@tanstack/react-router';

import { OrdersPage } from '@/modules/order';
import { GeneralError, NotFoundError } from '@/shared/ui/errors';
import { PageLoading } from '@/shared/ui/page';

const AdminOrdersPage = () => {
  return <OrdersPage mode='admin' />;
};

export const Route = createFileRoute('/admin/orders/')({
  component: AdminOrdersPage,
  pendingComponent: PageLoading,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError
});
