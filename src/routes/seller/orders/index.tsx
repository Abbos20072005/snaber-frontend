import { createFileRoute } from '@tanstack/react-router';

import { OrdersPage } from '@/modules/order';
import { GeneralError, NotFoundError } from '@/shared/ui/errors';
import { PageLoading } from '@/shared/ui/page';

const SellerOrdersPage = () => {
  return <OrdersPage mode='customer' />;
};

export const Route = createFileRoute('/seller/orders/')({
  component: SellerOrdersPage,
  pendingComponent: PageLoading,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError
});
