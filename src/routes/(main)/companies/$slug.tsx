// ============================================================================
// FEATURE DISABLED: Company mini-site page.
// ============================================================================
// Original implementation is commented out below. The route is kept as a stub
// that redirects to the home page.
//
// import { createFileRoute } from '@tanstack/react-router';
//
// import { getPublicCompanyByIdOptions } from '@/modules/company';
// import { SitePage } from '@/modules/mini-site';
// import { extractSlugId } from '@/shared/constants';
// import { getLocale } from '@/shared/i18n';
// import {
//   createBreadcrumbJsonLd,
//   createOrganizationJsonLd,
//   createSeoMeta,
//   DEFAULT_OG_IMAGE
// } from '@/shared/lib/seo';
// import { GeneralError, NotFoundError } from '@/shared/ui/errors';
// import { PageLoading } from '@/shared/ui/page';
//
// export const Route = createFileRoute('/(main)/companies/$slug')({
//   loader: ({ context: { queryClient }, params: { slug } }) => {
//     const id = extractSlugId(slug);
//     return queryClient.ensureQueryData(getPublicCompanyByIdOptions({ id }));
//   },
//   head: ({ loaderData, match }) => {
//     const company = loaderData;
//     const siteUrl = import.meta.env.VITE_SITE_URL || '';
//
//     if (!company) {
//       return {
//         ...createSeoMeta({
//           title: 'Company details',
//           description:
//             'View company profile, products, certificates, contacts, and supplier information.',
//           locale: getLocale()
//         })
//       };
//     }
//
//     const companyName = company.name;
//     const canonicalUrl = siteUrl ? `${siteUrl}${match.pathname}` : undefined;
//     const companyImage = company.cover?.url || company.logo;
//
//     return {
//       ...createSeoMeta({
//         title: companyName,
//         description:
//           company.description ||
//           `View ${companyName} company profile, products, certificates, contacts, and supplier information.`,
//         image: companyImage || (siteUrl ? `${siteUrl}${DEFAULT_OG_IMAGE.url}` : DEFAULT_OG_IMAGE.url),
//         imageWidth: companyImage ? undefined : DEFAULT_OG_IMAGE.width,
//         imageHeight: companyImage ? undefined : DEFAULT_OG_IMAGE.height,
//         url: canonicalUrl,
//         locale: getLocale()
//       }),
//       scripts: [
//         ...createOrganizationJsonLd({
//           name: companyName,
//           url: canonicalUrl,
//           logo: company.logo || undefined,
//           description: company.description || undefined
//         }).scripts,
//         ...createBreadcrumbJsonLd([
//           { name: 'Home', url: siteUrl ? `${siteUrl}/` : '/' },
//           { name: 'Companies', url: siteUrl ? `${siteUrl}/companies` : '/companies' },
//           { name: companyName, url: canonicalUrl || match.pathname }
//         ]).scripts
//       ]
//     };
//   },
//   component: SitePage,
//   pendingComponent: PageLoading,
//   notFoundComponent: NotFoundError,
//   errorComponent: GeneralError
// });

import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/(main)/companies/$slug')({
  component: () => <Navigate to='/' />
});
