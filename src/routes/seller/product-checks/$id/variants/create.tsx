import { createFileRoute, useParams } from '@tanstack/react-router';

import { ProductVariantUpsert } from '@/modules/products';
import { GeneralError, NotFoundError } from '@/shared/ui/errors';
import { PageLoading } from '@/shared/ui/page';

const ProductVariantCreateRoute = () => {
  const params = useParams({ from: '/seller/product-checks/$id/variants/create' });

  return <ProductVariantUpsert url='/seller/product-checks' constructorId={+params.id} />;
};

export const Route = createFileRoute('/seller/product-checks/$id/variants/create')({
  component: ProductVariantCreateRoute,
  pendingComponent: PageLoading,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError
});
