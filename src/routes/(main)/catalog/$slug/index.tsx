import { useLingui } from '@lingui/react/macro';
import { useInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useParams, useSearch } from '@tanstack/react-router';

import {
  CategoryBreadcrumb,
  CategoryChildrenGrid,
  getCategoryBreadcrumbByIdOptions,
  getPublicCategoryByIdOptions
} from '@/modules/category';
import { FilterSection, MobileFilter } from '@/modules/filter';
import {
  getPublicProductsInfiniteOptions,
  ProductList,
  ProductListSkeleton
} from '@/modules/products';
import { extractSlugId, generateSlugId } from '@/shared/constants';
import { getLocale } from '@/shared/i18n';
import { createBreadcrumbJsonLd, createSeoMeta, DEFAULT_OG_IMAGE } from '@/shared/lib/seo';
import { Button } from '@/shared/ui/button';
import { GeneralError, NotFoundError } from '@/shared/ui/errors';
import { PageLoading } from '@/shared/ui/page';
import { SectionWrapper } from '@/shared/ui/section-wrapper';

const RouteComponent = () => {
  const { t } = useLingui();
  const { slug } = useParams({ from: '/(main)/catalog/$slug/' });
  const params = useSearch({ from: '/(main)/catalog/$slug/' });
  const id = extractSlugId(slug);
  const categoriesQuery = useSuspenseQuery(getPublicCategoryByIdOptions({ id }));
  const categories = categoriesQuery.data;

  // Only the last level of the tree lists products; every level above it drills down.
  const hasChildren = !categories.is_leaf && categories.children.length > 0;

  const productsQuery = useInfiniteQuery({
    ...getPublicProductsInfiniteOptions({
      params: {
        category: id,
        page_size: 12,
        ...params
      }
    }),
    enabled: !hasChildren
  });
  const products = productsQuery.data?.pages.flatMap((page) => page.results ?? []);

  return (
    <div>
      <SectionWrapper title={categories.name}>
        <CategoryBreadcrumb id={id} />

        {hasChildren ? (
          <CategoryChildrenGrid categories={categories.children} />
        ) : (
          <>
            <div className='flex w-full items-center justify-between md:hidden'>
              <h2 className='text-muted-foreground text-lg font-semibold'>{t`Filter`}</h2>
              <MobileFilter category={id} />
            </div>
            <div className='relative flex items-start gap-4'>
              <FilterSection
                className='no-scrollbar sticky top-27 hidden max-h-[calc(100vh-6.75rem)] max-w-70 shrink-0 overflow-y-auto md:block'
                category={id}
              />

              {productsQuery.isPending && (
                <ProductListSkeleton className='w-full flex-1' view='grid' count={12} />
              )}
              {!productsQuery.isPending && products && products.length > 0 && (
                <div className='flex flex-1 flex-col gap-8'>
                  <ProductList className='flex-1' view='grid' products={products} />
                  <div className='flex items-center justify-center'>
                    {productsQuery.hasNextPage && (
                      <Button
                        loading={productsQuery.isFetchingNextPage}
                        onClick={() => productsQuery.fetchNextPage()}
                      >
                        {t`Show More`}
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {products?.length === 0 && !productsQuery.isPending && (
                <div className='flex min-h-[60svh] flex-1 items-center justify-center'>
                  <p className='text-2xl font-medium'>{t`Data not found`}</p>
                </div>
              )}
            </div>
          </>
        )}
      </SectionWrapper>
    </div>
  );
};

export const Route = createFileRoute('/(main)/catalog/$slug/')({
  loader: ({ context: { queryClient }, params: { slug } }) => {
    const id = extractSlugId(slug);
    return Promise.all([
      queryClient.ensureQueryData(getPublicCategoryByIdOptions({ id })),
      queryClient.ensureQueryData(getCategoryBreadcrumbByIdOptions({ id }))
    ]);
  },
  pendingComponent: PageLoading,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
  component: RouteComponent,
  head: ({ loaderData, match }) => {
    const category = loaderData?.[0] as
      | {
          image?: string | null;
          name: string;
        }
      | undefined;

    const breadcrumb = loaderData?.[1] as Breadcrumb[] | undefined;
    const siteUrl = import.meta.env.VITE_SITE_URL || '';
    const hasFilters = Object.keys(match.search ?? {}).length > 0;

    if (!category) {
      return {
        ...createSeoMeta({
          title: 'Catalog',
          description: 'Browse building materials and tools categories on snaber.uz.',
          locale: getLocale()
        })
      };
    }

    const categoryName = category.name;
    const canonicalUrl = siteUrl ? `${siteUrl}${match.pathname}` : undefined;

    const breadcrumbItems = [
      { name: 'Home', url: siteUrl || '/' },
      { name: 'Catalog', url: siteUrl ? `${siteUrl}/catalog` : '/catalog' },
      ...(breadcrumb?.map((item, index) => ({
        name: item.name,
        url:
          index === breadcrumb.length - 1
            ? canonicalUrl || match.pathname
            : `${siteUrl}/catalog/${generateSlugId(item.id, item.name)}`
      })) ?? [])
    ];

    return {
      ...createSeoMeta({
        title: categoryName,
        description: `Browse ${categoryName} building materials and tools with filters on snaber.uz.`,
        image:
          category.image || (siteUrl ? `${siteUrl}${DEFAULT_OG_IMAGE.url}` : DEFAULT_OG_IMAGE.url),
        imageWidth: category.image ? undefined : DEFAULT_OG_IMAGE.width,
        imageHeight: category.image ? undefined : DEFAULT_OG_IMAGE.height,
        url: canonicalUrl,
        locale: getLocale(),
        noindex: hasFilters
      }),
      scripts: createBreadcrumbJsonLd(breadcrumbItems).scripts
    };
  }
});
