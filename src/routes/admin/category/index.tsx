import { useLingui } from '@lingui/react/macro';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

import { CategoriesTable, CategoryDialog, getAllCategoriesQueryOptions } from '@/modules/category';
import { Button } from '@/shared/ui/button.tsx';
import { PageContent, PageHeader } from '@/shared/ui/page';

const CategoryPage = () => {
  const [createDialog, setCreateDialog] = useState<boolean>(false);
  const { t } = useLingui();

  const categoriesQuery = useSuspenseQuery(getAllCategoriesQueryOptions());
  const categories = categoriesQuery.data?.data || [];

  return (
    <>
      <PageHeader className='justify-end'>
        <Button onClick={() => setCreateDialog(true)}>{t`Create`}</Button>
      </PageHeader>
      <PageContent>
        <CategoriesTable categories={categories} />
        <CategoryDialog onOpenChange={setCreateDialog} open={createDialog} />
      </PageContent>
    </>
  );
};

export const Route = createFileRoute('/admin/category/')({
  component: CategoryPage,
  loader: ({ context: { queryClient } }) =>
    queryClient.prefetchQuery(getAllCategoriesQueryOptions())
});
