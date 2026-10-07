import { useLingui } from '@lingui/react/macro';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';

import { AttributeValueDialog, AttributeValuesTable } from '@/modules/attributes';
import { Button } from '@/shared/ui/button';
import { PageContent, PageHeader } from '@/shared/ui/page';

export const AttributeValuesAdminPage = () => {
  const { t } = useLingui();
  const [createDialog, setCreateDialog] = useState<boolean>(false);

  return (
    <>
      <PageHeader className='h-fit justify-between pt-4'>
        <div>
          <h1 className='text-primary text-2xl font-semibold'>{t`Attribute values`}</h1>
          <p className='text-muted-foreground text-sm'>
            {t`Manage reusable values assigned to product attributes.`}
          </p>
        </div>
        <Button onClick={() => setCreateDialog(true)}>
          <PlusIcon />
          {t`Create value`}
        </Button>
      </PageHeader>
      <PageContent>
        <AttributeValuesTable />
        <AttributeValueDialog onOpenChange={setCreateDialog} open={createDialog} />
      </PageContent>
    </>
  );
};
