import { useLingui } from '@lingui/react/macro';
import { useInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute, useSearch } from '@tanstack/react-router';
import { parseAsString, useQueryState } from 'nuqs';

import { FilterSection, MobileFilter } from '@/modules/filter';
import {
  getPublicProductsInfiniteOptions,
  ProductList,
  ProductListSkeleton
} from '@/modules/products';
import { getLocale } from '@/shared/i18n';
import { createSeoMeta, DEFAULT_OG_IMAGE } from '@/shared/lib/seo';
import { Button } from '@/shared/ui/button';
import { SectionWrapper } from '@/shared/ui/section-wrapper';

const RouteComponent = () => {
  const { t } = useLingui();
  const [search] = useQueryState('search', parseAsString.withDefault(''));
  const params = useSearch({ from: '/(main)/products/' }) as { category?: number | string };

  const getAllProductsQuery = useInfiniteQuery(
    getPublicProductsInfiniteOptions({
      params: {
        page_size: 12,
        ...params
      }
    })
  );
  const products = getAllProductsQuery.data?.pages.flatMap((page) => page.results ?? []);

  return (
    <SectionWrapper title={search && `${t`Search results for`}: ${search}`}>
      <div className='flex w-full items-center justify-between md:hidden'>
        <h2 className='text-muted-foreground text-lg font-semibold'>{t`Filter`}</h2>
        <MobileFilter category={params?.category} />
      </div>
      <div className='relative flex items-start gap-4'>
        <FilterSection
          className='no-scrollbar sticky top-27 hidden max-h-[calc(100vh-6.75rem)] max-w-70 shrink-0 overflow-y-auto md:block'
          category={params?.category}
        />
        {getAllProductsQuery.isPending && (
          <div className='w-full flex-1'>
            <ProductListSkeleton view='grid' count={12} />
          </div>
        )}

        {!getAllProductsQuery.isPending && products && products.length > 0 && (
          <div className='flex flex-1 flex-col gap-8'>
            <ProductList className='flex-1' view='grid' products={products} />
            <div className='flex items-center justify-center'>
              {getAllProductsQuery.hasNextPage && (
                <Button
                  loading={getAllProductsQuery.isFetchingNextPage}
                  onClick={() => getAllProductsQuery.fetchNextPage()}
                >
                  {t`Show More`}
                </Button>
              )}
            </div>
          </div>
        )}

        {products?.length === 0 && !getAllProductsQuery.isPending && (
          <div className='flex min-h-[60svh] flex-1 items-center justify-center'>
            <p className='text-2xl font-medium'>{t`Data not found`}</p>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
};

export const Route = createFileRoute('/(main)/products/')({
  loader: async ({ context: { queryClient }, location: { search } }) => {
    await queryClient.prefetchInfiniteQuery(
      getPublicProductsInfiniteOptions({ params: { page_size: 12, ...search } })
    );
  },
  component: RouteComponent,
  head: ({ match }) => {
    const siteUrl = import.meta.env.VITE_SITE_URL || '';
    const search = (match.search as { search?: string })?.search;

    return createSeoMeta({
      title: search ? `Search results for "${search}"` : 'Search products',
      description: search
        ? `Search results for "${search}" — building materials and tools on snaber.uz.`
        : 'Search building materials and tools on snaber.uz — filter by category and find what you need.',
      locale: getLocale(),
      image: siteUrl ? `${siteUrl}${DEFAULT_OG_IMAGE.url}` : DEFAULT_OG_IMAGE.url,
      imageWidth: DEFAULT_OG_IMAGE.width,
      imageHeight: DEFAULT_OG_IMAGE.height,
      noindex: true
    });
  }
});
