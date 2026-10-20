import { useLingui } from '@lingui/react/macro';
import { createFileRoute, Link } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';

import { ProductsTable } from '@/modules/products';
import { buttonVariants } from '@/shared/ui/button';
import { GeneralError, NotFoundError } from '@/shared/ui/errors';
import { PageContent, PageLoading } from '@/shared/ui/page';

const ProductsPage = () => {
  const { t } = useLingui();

  return (
    <PageContent className='space-y-6'>
      <div className='items-start justify-between gap-4 md:flex'>
        <div>
          <h1 className='text-primary text-2xl font-semibold'>{t`Products`}</h1>
          <p className='text-muted-foreground mt-1 text-sm'>
            {t`Add products, set prices and keep the stock up to date.`}
          </p>
        </div>
        <Link className={buttonVariants()} to='/admin/products/create'>
          <PlusIcon />
          {t`Create product`}
        </Link>
      </div>
      <ProductsTable />
    </PageContent>
  );
};

export const Route = createFileRoute('/admin/products/')({
  component: ProductsPage,
  pendingComponent: PageLoading,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError
});
