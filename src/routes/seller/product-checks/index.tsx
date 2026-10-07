import { useLingui } from '@lingui/react/macro';
import { createFileRoute, Link } from '@tanstack/react-router';
import { BoxesIcon } from 'lucide-react';

import { DraftProductsTable } from '@/modules/draft';
import { buttonVariants } from '@/shared/ui/button.tsx';
import { GeneralError, NotFoundError } from '@/shared/ui/errors';
import { PageContent, PageHeader, PageLoading } from '@/shared/ui/page';

const ProductCheckPage = () => {
  const { t } = useLingui();

  return (
    <>
      <PageHeader className='h-fit items-start justify-between pt-4'>
        <div className='grid gap-2'>
          <div className='flex items-center gap-3'>
            <div className='bg-primary/10 text-primary grid size-10 place-items-center rounded-md'>
              <BoxesIcon className='size-5' />
            </div>
            <div>
              <h1 className='font-heading text-2xl font-semibold'>{t`Product checks`}</h1>
            </div>
          </div>
        </div>
        <Link className={buttonVariants()} to='/seller/product-checks/create'>{t`Create`}</Link>
      </PageHeader>
      <PageContent>
        <DraftProductsTable detailUrl='/seller/product-checks/$id' from='/seller/product-checks/' />
      </PageContent>
    </>
  );
};

export const Route = createFileRoute('/seller/product-checks/')({
  component: ProductCheckPage,
  pendingComponent: PageLoading,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError
});
