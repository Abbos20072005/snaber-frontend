import { useLingui } from '@lingui/react/macro';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';

import {
  CategoryCard,
  CategoryPendingComponent,
  getPublicAllCategoriesOptions
} from '@/modules/category';
import { generateSlugId } from '@/shared/constants';
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
  const categories = categoriesQuery.data;

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
        <div className='grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-2 md:grid-cols-[repeat(auto-fill,minmax(230px,1fr))] md:gap-4'>
          {categories.map((item) => (
            <Link
              key={item.id}
              params={{ slug: generateSlugId(item.id, item.name) }}
              to={'/catalog/$slug'}
            >
              <CategoryCard category={item} />
            </Link>
          ))}
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
