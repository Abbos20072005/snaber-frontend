import { createFileRoute } from '@tanstack/react-router';

import { ProductCreate } from '@/modules/products';
import { GeneralError, NotFoundError } from '@/shared/ui/errors';
import { PageLoading } from '@/shared/ui/page';

const ProductCreatePage = () => <ProductCreate url='/admin/product-checks' />;

export const Route = createFileRoute('/admin/product-checks/create')({
  component: ProductCreatePage,
  pendingComponent: PageLoading,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError
});
