import { createFileRoute, useParams } from '@tanstack/react-router';

import { ProductDetail } from '@/modules/products';
import { GeneralError, NotFoundError } from '@/shared/ui/errors';
import { PageLoading } from '@/shared/ui/page';

const ProductDetailRoute = () => {
  const params = useParams({ from: '/admin/products/$id/' });
  const id = +params.id;

  return <ProductDetail id={id} url='/admin/products' enableActions={false} />;
};

export const Route = createFileRoute('/admin/products/$id/')({
  component: ProductDetailRoute,
  pendingComponent: PageLoading,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError
});
