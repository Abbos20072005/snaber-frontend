import { useLingui } from '@lingui/react/macro';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

import { UnitDialog, UnitsOfMeasureCards } from '@/modules/unit-of-measure';
import { Button } from '@/shared/ui/button';
import { GeneralError, NotFoundError } from '@/shared/ui/errors';
import { PageContent, PageHeader, PageLoading } from '@/shared/ui/page';

const UnitOfMeasurePage = () => {
  const { t } = useLingui();
  const [createDialog, setCreateDialog] = useState<boolean>(false);

  return (
    <>
      <PageHeader className='justify-between gap-10'>
        <h2 className='text-primary text-2xl font-semibold'>{t`Unit of Measures`}</h2>
        <Button onClick={() => setCreateDialog(true)}>{t`Create`}</Button>
      </PageHeader>
      <PageContent>
        <UnitsOfMeasureCards />
        <UnitDialog onOpenChange={setCreateDialog} open={createDialog} />
      </PageContent>
    </>
  );
};

export const Route = createFileRoute('/admin/unit-of-measure/')({
  component: UnitOfMeasurePage,
  pendingComponent: PageLoading,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError
});
