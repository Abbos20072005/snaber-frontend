import { useLingui } from '@lingui/react/macro';
import { createFileRoute, Link } from '@tanstack/react-router';

import { getProductRequestsQueryOptions, ProductRequestsTable } from '@/modules/product-requests';
import { buttonVariants } from '@/shared/ui/button';
import { GeneralError, NotFoundError } from '@/shared/ui/errors';
import { PageContent, PageLoading } from '@/shared/ui/page';

const RequestsPage = () => {
  const { t } = useLingui();

  return (
    <PageContent className='space-y-6'>
      <div className='flex flex-wrap items-start justify-between gap-3'>
        <div>
          <h1 className='text-primary text-2xl font-semibold'>{t`Requests`}</h1>
          <p className='text-muted-foreground mt-1 text-sm'>
            {t`Products and lists the clients could not find in the catalog.`}
          </p>
        </div>
        <Link className={buttonVariants({ variant: 'outline' })} to='/admin/requests/wanted'>
          {t`Wanted products`}
        </Link>
      </div>
      <ProductRequestsTable />
    </PageContent>
  );
};

export const Route = createFileRoute('/admin/requests/')({
  component: RequestsPage,
  pendingComponent: PageLoading,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
  loader: ({ context: { queryClient } }) =>
    queryClient.prefetchQuery(
      getProductRequestsQueryOptions({
        params: {
          page: 1,
          page_size: 10
        }
      })
    )
});
