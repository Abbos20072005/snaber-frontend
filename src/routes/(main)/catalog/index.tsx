import { useLingui } from '@lingui/react/macro';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';

import {
  CategoryPendingComponent,
  CategorySidebar,
  CategoryTile,
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

  const categoriesQuery = useSuspenseQuery(getPublicAllCategoriesOptions());
  const roots = categoriesQuery.data ?? [];
  const [selectedId, setSelectedId] = useState<number | undefined>(roots[0]?.id);
  const selected = roots.find((root) => root.id === selectedId) ?? roots[0];
  const tiles = selected?.children ?? [];

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
        <div className='flex flex-col gap-6 md:flex-row'>
          <CategorySidebar roots={roots} selectedId={selected?.id} onSelect={setSelectedId} />
          <div className='min-w-0 flex-1'>
            {selected && (
              <>
                <p className='text-primary text-xl font-semibold'>{selected.name}</p>
                <div className='mt-3 grid grid-cols-4 gap-x-2 gap-y-4 sm:grid-cols-6 xl:grid-cols-8'>
                  {tiles.map((child) => (
                    <CategoryTile key={child.id} category={child} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
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
