import { useLingui } from '@lingui/react/macro';
import { createFileRoute, Link } from '@tanstack/react-router';

import { getWantedProductsQueryOptions, WantedProductsTable } from '@/modules/product-requests';
import { buttonVariants } from '@/shared/ui/button';
import { GeneralError, NotFoundError } from '@/shared/ui/errors';
import { PageContent, PageLoading } from '@/shared/ui/page';

const WantedProductsPage = () => {
  const { t } = useLingui();

  return (
    <PageContent className='space-y-6'>
      <div className='flex flex-wrap items-start justify-between gap-3'>
        <div>
          <h1 className='text-primary text-2xl font-semibold'>{t`Wanted products`}</h1>
          <p className='text-muted-foreground mt-1 text-sm'>
            {t`Products the clients asked for and we do not have yet. Add them to the catalog.`}
          </p>
        </div>
        <Link className={buttonVariants({ variant: 'outline' })} to='/admin/requests'>
          {t`Requests`}
        </Link>
      </div>
      <WantedProductsTable />
    </PageContent>
  );
};

export const Route = createFileRoute('/admin/requests/wanted')({
  component: WantedProductsPage,
  pendingComponent: PageLoading,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
  loader: ({ context: { queryClient } }) =>
    queryClient.prefetchQuery(
      getWantedProductsQueryOptions({
        params: {
          page: 1,
          page_size: 10
        }
      })
    )
});
