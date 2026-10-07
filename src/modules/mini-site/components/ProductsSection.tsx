import { useLingui } from '@lingui/react/macro';
import { useInfiniteQuery, useQueries, useQuery } from '@tanstack/react-query';
import { useParams, useSearch } from '@tanstack/react-router';
import { SearchIcon } from 'lucide-react';
import { parseAsString, useQueryState } from 'nuqs';
import { useMemo } from 'react';

import { getPublicCategoryByIdOptions } from '@/modules/category';
import {
  getMiniSiteProductsInfiniteQueryOptions,
  getMiniSiteProductsQueryOptions
} from '@/modules/company';
import { MiniSiteFilterSection, MobileFilter } from '@/modules/filter';
import { ProductList, ProductListSkeleton } from '@/modules/products';
import { extractSlugId } from '@/shared/constants';
import { useDebouncedValue } from '@/shared/hooks/useDeboucedValue';
import { Button } from '@/shared/ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/shared/ui/input-group';

interface MiniSiteProductCategory {
  id: number;
  name?: string;
}

type ProductPreviewCategory = number | MiniSiteProductCategory;

const getProductCategory = (product: ProductPreview): MiniSiteProductCategory | null => {
  const category = product.category as ProductPreviewCategory | undefined;

  if (!category) return null;

  if (typeof category === 'number') return { id: category };

  return {
    id: category.id,
    name: category.name
  };
};

export const ProductsSection = () => {
  const { t } = useLingui();

  const [search, setSearch] = useQueryState('search', parseAsString.withDefault(''));
  const debouncingSearch = useDebouncedValue(search, 300);

  const params = useSearch({ from: '/(main)/companies/$slug' }) as { category?: number | string };
  const { slug } = useParams({ from: '/(main)/companies/$slug' });
  const id = extractSlugId(slug);
  
  const productsQuery = useInfiniteQuery(
    getMiniSiteProductsInfiniteQueryOptions({
      id,
      params: { ...params, page_size: 12, search: debouncingSearch }
    })
  );
  const products = productsQuery.data?.pages.flatMap((page) => page.data.results) ?? [];
  const allProductsQuery = useQuery(
    getMiniSiteProductsQueryOptions({
      id,
      params: {
        page_size: 12
      }
    })
  );

  const categorySnapshots = useMemo(() => {
    const categoriesById = new Map<number, MiniSiteProductCategory>();

    for (const product of allProductsQuery.data?.data.results ?? []) {
      const category = getProductCategory(product);

      if (!category || categoriesById.has(category.id)) continue;

      categoriesById.set(category.id, category);
    }

    return Array.from(categoriesById.values());
  }, [allProductsQuery.data]);

  const categoryQueries = useQueries({
    queries: categorySnapshots.map((category) => ({
      ...getPublicCategoryByIdOptions({ id: category.id }),
      enabled: !category.name
    }))
  });

  const categories = categorySnapshots.map((category, index) => ({
    id: category.id,
    name: category.name ?? categoryQueries[index]?.data?.name ?? `${category.id}`
  }));
  const miniSiteCategories = allProductsQuery.isPending ? undefined : categories;


  return (
    <section className='grid relative gap-4 md:grid-cols-[230px_minmax(0,1fr)]'>
      <MiniSiteFilterSection className='hidden md:block top-19 sticky' categories={miniSiteCategories} />
      <div className='space-y-4'>
        <div className='ring-muted flex justify-between gap-4 rounded-2xl bg-white p-3 shadow-sm ring-1 md:grid-cols-[minmax(0,1fr)_140px_140px]'>
          <label>
            <InputGroup className='max-w-xs'>
              <InputGroupInput
                className='w-full'
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t`Search...`}
              />
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
            </InputGroup>
          </label>
          <MobileFilter category={params?.category} miniSiteCategories={miniSiteCategories} />
        </div>
        {productsQuery.isPending ? (
          <ProductListSkeleton view='grid' count={12} isShowCompany={false} />
        ) : (
          <ProductList view='grid' isShowCompany={false} products={products} />
        )}
        {products?.length === 0 && !productsQuery.isPending && (
          <div className='col-span-10 flex h-full items-center justify-center'>
            <p className='text-2xl font-medium'>{t`Data not found`}</p>
          </div>
        )}
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
    </section>
  );
};
