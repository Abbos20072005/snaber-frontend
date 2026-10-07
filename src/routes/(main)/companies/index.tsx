// ============================================================================
// FEATURE DISABLED: Companies list page.
// ============================================================================
// Original implementation is commented out below. The route is kept as a stub
// that redirects to the home page.
//
// import { useLingui } from '@lingui/react/macro';
// import { useInfiniteQuery } from '@tanstack/react-query';
// import { createFileRoute, Link, useSearch } from '@tanstack/react-router';
// import { DownloadIcon } from 'lucide-react';
// import { parseAsString, useQueryState } from 'nuqs';
//
// import {
//   CompanyCard,
//   CompanyCardSkeleton,
//   CompanyFilterSection,
//   CompanySearchGroup,
//   getAllCompaniesInfiniteOptions
// } from '@/modules/company';
// import { downloadWithAuth } from '@/shared/constants/downloadFile';
// import { useDebouncedValue } from '@/shared/hooks/useDeboucedValue';
// import { getLocale } from '@/shared/i18n';
// import { createBreadcrumbJsonLd, createSeoMeta, DEFAULT_OG_IMAGE } from '@/shared/lib/seo';
// import { cn } from '@/shared/lib/utils';
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator
// } from '@/shared/ui/breadcrumb';
// import { Button } from '@/shared/ui/button';
// import { GeneralError, NotFoundError } from '@/shared/ui/errors';
// import { PageLoading } from '@/shared/ui/page';
// import { SectionWrapper } from '@/shared/ui/section-wrapper';
// import { Skeleton } from '@/shared/ui/skeleton';
//
// const RouteComponent = () => {
//   const { t } = useLingui();
//   const params = useSearch({ from: '/(main)/companies/' });
//   const [search, setSearch] = useQueryState('search', parseAsString.withDefault(''));
//   const debouncedSearch = useDebouncedValue(search, 300);
//
//   const companyParams = {
//     ...params,
//     search: debouncedSearch
//   };
//
//   const getAllCompanyQuery = useInfiniteQuery(
//     getAllCompaniesInfiniteOptions({
//       params: companyParams
//     })
//   );
//   const companies = getAllCompanyQuery.data?.pages.flatMap((page) => page.results) ?? [];
//
//   const queryParams = new URLSearchParams(companyParams);
//
//   const downloadUrl = `${import.meta.env.VITE_API_URL}company/public/excel/?${queryParams.toString()}`;
//
//   return (
//     <div>
//       <SectionWrapper
//         title={t`Companies`}
//         description={t`Factories and sellers you can order from`}
//       >
//         <Breadcrumb>
//           <BreadcrumbList>
//             <BreadcrumbItem>
//               <BreadcrumbLink render={<Link to='/'>{t`Home`}</Link>} />
//             </BreadcrumbItem>
//             <BreadcrumbSeparator />
//             <BreadcrumbItem>
//               <BreadcrumbPage>{t`Companies`}</BreadcrumbPage>
//             </BreadcrumbItem>
//           </BreadcrumbList>
//         </Breadcrumb>
//
//         <div className='space-y-10'>
//           <div className='flex flex-col gap-5'>
//             <div
//               className={cn('flex justify-between gap-3', companies.length !== 0 && 'flex-wrap')}
//             >
//               <CompanySearchGroup search={search} setSearch={setSearch} />
//               <div
//                 className={cn(
//                   'flex items-center gap-4 md:w-auto md:flex-row-reverse md:justify-items-start',
//                   companies.length !== 0 ? 'w-full justify-between' : 'w-auto justify-end'
//                 )}
//               >
//                 {companies.length !== 0 && (
//                   <Button variant='default' onClick={() => downloadWithAuth(downloadUrl)}>
//                     <DownloadIcon className='mr-2 h-4 w-4' />
//                     {t`Download`}
//                   </Button>
//                 )}
//                 <CompanyFilterSection />
//               </div>
//             </div>
//             <h2 className='text-primary flex items-center gap-2 text-lg font-medium'>
//               {getAllCompanyQuery.isPending ? (
//                 <Skeleton className='h-5 w-44' />
//               ) : (
//                 `${t`Total companies`} ${getAllCompanyQuery.data?.pages[0]?.count ?? 0}`
//               )}
//             </h2>
//           </div>
//           <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
//             {getAllCompanyQuery.isPending
//               ? Array.from({ length: 10 }).map((_, index) => <CompanyCardSkeleton key={index} />)
//               : companies?.map((item, index) => <CompanyCard key={index} company={item} />)}
//           </div>
//
//           <div className='flex items-center justify-center'>
//             {getAllCompanyQuery.hasNextPage && (
//               <Button
//                 loading={getAllCompanyQuery.isFetchingNextPage}
//                 onClick={() => getAllCompanyQuery.fetchNextPage()}
//               >
//                 {t`Show More`}
//               </Button>
//             )}
//             {companies.length === 0 && !getAllCompanyQuery.isPending && (
//               <p className='text-2xl font-medium'>{t`Data not found`}</p>
//             )}
//           </div>
//         </div>
//       </SectionWrapper>
//     </div>
//   );
// };
//
// export const Route = createFileRoute('/(main)/companies/')({
//   loader: ({ context: { queryClient } }) =>
//     queryClient.prefetchInfiniteQuery(getAllCompaniesInfiniteOptions()),
//   component: RouteComponent,
//   head: ({ match }) => {
//     const siteUrl = import.meta.env.VITE_SITE_URL || '';
//     const canonicalUrl = siteUrl ? `${siteUrl}${match.pathname}` : undefined;
//     const hasFilters = Object.keys(match.search ?? {}).length > 0;
//
//     return {
//       ...createSeoMeta({
//         title: 'Companies',
//         description:
//           'Browse verified factories and sellers, compare company profiles, and find business suppliers for B2B orders.',
//         url: canonicalUrl,
//         locale: getLocale(),
//         image: siteUrl ? `${siteUrl}${DEFAULT_OG_IMAGE.url}` : DEFAULT_OG_IMAGE.url,
//         imageWidth: DEFAULT_OG_IMAGE.width,
//         imageHeight: DEFAULT_OG_IMAGE.height,
//         noindex: hasFilters
//       }),
//       scripts: createBreadcrumbJsonLd([
//         { name: 'Home', url: siteUrl || '/' },
//         { name: 'Companies', url: canonicalUrl || '/companies' }
//       ]).scripts
//     };
//   },
//   pendingComponent: PageLoading,
//   notFoundComponent: NotFoundError,
//   errorComponent: GeneralError
// });

import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/(main)/companies/')({
  component: () => <Navigate to='/' />
});
