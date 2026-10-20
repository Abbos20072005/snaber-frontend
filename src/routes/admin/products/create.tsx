import { createFileRoute } from '@tanstack/react-router';

import { ProductCreate } from '@/modules/products';
import { GeneralError, NotFoundError } from '@/shared/ui/errors';
import { PageLoading } from '@/shared/ui/page';

export const Route = createFileRoute('/admin/products/create')({
  component: ProductCreate,
  pendingComponent: PageLoading,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError
});
