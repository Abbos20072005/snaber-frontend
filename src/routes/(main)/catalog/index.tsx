import { useLingui } from '@lingui/react/macro';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Suspense } from 'react';

import {
  CategoryDirectory,
  CategoryDirectorySkeleton,
  CategoryPendingComponent,
  getPublicAllCategoriesOptions
} from '@/modules/category';
import { getLocale } from '@/shared/i18n';
import { createBreadcrumbJsonLd, createSeoMeta, DEFAULT_OG_IMAGE } from '@/shared/lib/seo';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/shared/ui/breadcrumb';
import { GeneralError, NotFoundError } from '@/shared/ui/errors';
import { SectionWrapper } from '@/shared/ui/section-wrapper';

const RouteComponent = () => {
  const { t } = useLingui();

  return (
    <div>
      <SectionWrapper title={t`Catalog`}>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link to='/'>{t`Home`}</Link>} />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t`Catalog`}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Suspense fallback={<CategoryDirectorySkeleton />}>
          <CategoryDirectory />
        </Suspense>
      </SectionWrapper>
    </div>
  );
};

export const Route = createFileRoute('/(main)/catalog/')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(getPublicAllCategoriesOptions()),
  component: RouteComponent,
  pendingComponent: CategoryPendingComponent,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
  head: ({ match }) => {
    const siteUrl = import.meta.env.VITE_SITE_URL || '';
    const canonicalUrl = siteUrl ? `${siteUrl}${match.pathname}` : undefined;

    return {
      ...createSeoMeta({
        title: 'Catalog',
        description:
          'snaber.uz catalog — building materials and tools: cement, bricks, steel, lumber, roofing, paints and equipment.',
        url: canonicalUrl,
        locale: getLocale(),
        image: siteUrl ? `${siteUrl}${DEFAULT_OG_IMAGE.url}` : DEFAULT_OG_IMAGE.url,
        imageWidth: DEFAULT_OG_IMAGE.width,
        imageHeight: DEFAULT_OG_IMAGE.height
      }),
      scripts: createBreadcrumbJsonLd([
        { name: 'Home', url: siteUrl || '/' },
        { name: 'Catalog', url: canonicalUrl || '/catalog' }
      ]).scripts
    };
  }
});
