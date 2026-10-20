import { createFileRoute, useParams } from '@tanstack/react-router';

import { ProductEdit } from '@/modules/products';
import { GeneralError, NotFoundError } from '@/shared/ui/errors';
import { PageLoading } from '@/shared/ui/page';

const ProductEditRoute = () => {
  const params = useParams({ from: '/admin/products/$id/' });

  return <ProductEdit id={+params.id} />;
};

export const Route = createFileRoute('/admin/products/$id/')({
  component: ProductEditRoute,
  pendingComponent: PageLoading,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError
});
