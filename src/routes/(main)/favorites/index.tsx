import { useLingui } from '@lingui/react/macro';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { HeartIcon } from 'lucide-react';

import { getFavoritesQueryOptions, ProductList, ProductListSkeleton } from '@/modules/products';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/shared/ui/breadcrumb';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/shared/ui/empty';
import { SectionWrapper } from '@/shared/ui/section-wrapper';

const RouteComponent = () => {
  const { t } = useLingui();
  const favoritesQuery = useQuery(getFavoritesQueryOptions());
  const favorites = (favoritesQuery.data ?? []).map((item) => item.product);
  const { isPending } = favoritesQuery;
  return (
    <div>
      <SectionWrapper title={t`Favorites`}>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link to='/'>{t`Home`}</Link>} />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t`Favorites`}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {isPending ? (
          <ProductListSkeleton view='grid' />
        ) : (
          <ProductList view='grid' products={favorites} />
        )}
        {!isPending && !favorites.length && (
          <Empty className='w-full'>
            <EmptyHeader>
              <EmptyMedia className='bg-destructive/5' variant='icon'>
                <HeartIcon className='text-destructive' />
              </EmptyMedia>
              <EmptyTitle>{t`We keep your favorite products here.`}</EmptyTitle>
              <EmptyDescription>{t`Click the ♡ icon on items you usually order or want to buy later.`}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </SectionWrapper>
    </div>
  );
};

export const Route = createFileRoute('/(main)/favorites/')({
  component: RouteComponent
});
