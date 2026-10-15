import { useSuspenseQuery } from '@tanstack/react-query';

import { getPublicProductsQueryOptions, ProductList } from '@/modules/products';

export const TopProductsList = () => {
  const { data } = useSuspenseQuery(
    getPublicProductsQueryOptions({
      params: {
        is_popular: true
      }
    })
  );

  return <ProductList view='grid' products={data.results} />;
};
