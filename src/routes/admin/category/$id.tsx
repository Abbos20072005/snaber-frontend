import { useLingui } from '@lingui/react/macro';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useParams } from '@tanstack/react-router';
import { useState } from 'react';

import {
  CategoriesTable,
  CategoryAdminBreadcrumb,
  CategoryDialog,
  getCategoryByIdQueryOptions
} from '@/modules/category';
import { Button } from '@/shared/ui/button';
import { PageContent, PageHeader } from '@/shared/ui/page';

const CategorySubPage = () => {
  const { t } = useLingui();
  const [createDialog, setCreateDialog] = useState<boolean>(false);
  const { id } = useParams({ from: '/admin/category/$id' });
  const categoriesSuspenseQuery = useSuspenseQuery(getCategoryByIdQueryOptions({ id: +id }));
  const categories = categoriesSuspenseQuery.data;

  return (
    <>
      <PageHeader className='flex items-center justify-between'>
        <CategoryAdminBreadcrumb id={+id} />
        <Button onClick={() => setCreateDialog(true)}>{t`Create`}</Button>
      </PageHeader>
      <PageContent className='space-y-2'>
        <CategoriesTable categories={categories.children} />
        <CategoryDialog onOpenChange={setCreateDialog} open={createDialog} />
      </PageContent>
    </>
  );
};

export const Route = createFileRoute('/admin/category/$id')({
  component: CategorySubPage,
  loader: ({ context: { queryClient }, params }) =>
    queryClient.prefetchQuery(getCategoryByIdQueryOptions({ id: +params.id }))
});
