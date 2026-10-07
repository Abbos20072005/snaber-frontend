import { useLingui } from '@lingui/react/macro';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

import { FaqDialog, FaqsDataTable } from '@/modules/faqs';
import { Button } from '@/shared/ui/button';
import { PageContent, PageHeader } from '@/shared/ui/page';

const RouteComponent = () => {
  const { t } = useLingui();
  const [createDialog, setCreateDialog] = useState(false);

  return (
    <>
      <PageHeader className='justify-between gap-10'>
        <h2 className='text-primary text-2xl font-semibold'>{t`Frequently Asked Questions`}</h2>
        <Button onClick={() => setCreateDialog(true)}>{t`Create`}</Button>
      </PageHeader>
      <PageContent>
        <FaqsDataTable />
      </PageContent>
      <FaqDialog onOpenChange={setCreateDialog} open={createDialog} />
    </>
  );
};

export const Route = createFileRoute('/admin/contents/faqs/')({
  component: RouteComponent
});
