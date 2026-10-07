import { createFileRoute } from '@tanstack/react-router';

import { ProductsTable } from '@/modules/products';
import { GeneralError, NotFoundError } from '@/shared/ui/errors';
import { PageContent, PageLoading } from '@/shared/ui/page';

const ProductsPage = () => {
  return (
    <PageContent>
      <ProductsTable from='/seller/products/' />
    </PageContent>
  );
};

export const Route = createFileRoute('/seller/products/')({
  component: ProductsPage,
  pendingComponent: PageLoading,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError
});
