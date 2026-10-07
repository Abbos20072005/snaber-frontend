import { createFileRoute } from '@tanstack/react-router';

import { ProductsTable } from '@/modules/products';
import { GeneralError, NotFoundError } from '@/shared/ui/errors';
import { PageContent, PageLoading } from '@/shared/ui/page';

const ProductsPage = () => {
  return (
    <PageContent>
      <ProductsTable from='/admin/products/' />
    </PageContent>
  );
};

export const Route = createFileRoute('/admin/products/')({
  component: ProductsPage,
  pendingComponent: PageLoading,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError
});
