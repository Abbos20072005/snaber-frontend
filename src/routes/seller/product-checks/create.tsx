import { createFileRoute } from '@tanstack/react-router';

import { ProductCreate } from '@/modules/products';
import { GeneralError, NotFoundError } from '@/shared/ui/errors';
import { PageLoading } from '@/shared/ui/page';

const ProductCreatePage = () => <ProductCreate url='/seller/product-checks' />;

export const Route = createFileRoute('/seller/product-checks/create')({
  component: ProductCreatePage,
  pendingComponent: PageLoading,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError
});
