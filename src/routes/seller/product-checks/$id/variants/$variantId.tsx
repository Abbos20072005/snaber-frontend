import { createFileRoute, useParams } from '@tanstack/react-router';

import { ProductVariantUpsert } from '@/modules/products';
import { GeneralError, NotFoundError } from '@/shared/ui/errors';
import { PageLoading } from '@/shared/ui/page';

const ProductVariantUpdateRoute = () => {
  const params = useParams({ from: '/seller/product-checks/$id/variants/$variantId' });

  return (
    <ProductVariantUpsert
      url='/seller/product-checks'
      variantId={+params.variantId}
      constructorId={+params.id}
    />
  );
};

export const Route = createFileRoute('/seller/product-checks/$id/variants/$variantId')({
  component: ProductVariantUpdateRoute,
  pendingComponent: PageLoading,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError
});
