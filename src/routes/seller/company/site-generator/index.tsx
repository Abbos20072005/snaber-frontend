// ============================================================================
// FEATURE DISABLED: Seller — mini-site generator.
// ============================================================================
// Original implementation is commented out below. The route is kept as a stub
// that redirects to the seller dashboard.
//
// import { useLingui } from '@lingui/react/macro';
// import { useSuspenseQuery } from '@tanstack/react-query';
// import { createFileRoute } from '@tanstack/react-router';
//
// import { getMiniSiteBySellerQueryOptions } from '@/modules/company';
// import { SitePageGenerator } from '@/modules/mini-site';
// import { Button } from '@/shared/ui/button';
// import { GeneralError, NotFoundError } from '@/shared/ui/errors';
// import { PageContent, PageHeader, PageLoading } from '@/shared/ui/page';
//
// const SiteGeneratorPage = () => {
//   const { t } = useLingui();
//   let miniSite;
//
//   try {
//     const miniSiteQuery = useSuspenseQuery(getMiniSiteBySellerQueryOptions());
//     miniSite = miniSiteQuery.data.data;
//     // eslint-disable-next-line unused-imports/no-unused-vars
//   } catch (e) {}
//
//   return (
//     <>
//       <PageHeader className='justify-end'>
//         <Button size='lg' type='submit' form='site-generator-form'>{t`Publish`}</Button>
//       </PageHeader>
//       <PageContent>
//         <SitePageGenerator miniSite={miniSite} />
//       </PageContent>
//     </>
//   );
// };
//
// export const Route = createFileRoute('/seller/company/site-generator/')({
//   component: SiteGeneratorPage,
//   loader: ({ context: { queryClient } }) => {
//     queryClient.prefetchQuery(getMiniSiteBySellerQueryOptions());
//   },
//   pendingComponent: PageLoading,
//   notFoundComponent: NotFoundError,
//   errorComponent: GeneralError
// });

import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/seller/company/site-generator/')({
  component: () => <Navigate to='/seller/dashboard' />
});
