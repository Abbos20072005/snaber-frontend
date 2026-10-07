import { createFileRoute, useParams } from '@tanstack/react-router';

import { DraftProductDetail } from '@/modules/draft';
import { GeneralError, NotFoundError } from '@/shared/ui/errors';
import { PageLoading } from '@/shared/ui/page';

const DraftProductDetailRoute = () => {
  const params = useParams({ from: '/seller/product-checks/$id/' });
  const id = +params.id;

  return <DraftProductDetail id={id} returnUrl='/seller/product-checks' mode='seller' />;
};

export const Route = createFileRoute('/seller/product-checks/$id/')({
  component: DraftProductDetailRoute,
  pendingComponent: PageLoading,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError
});
