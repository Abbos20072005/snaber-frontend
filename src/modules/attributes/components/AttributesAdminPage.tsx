import { useLingui } from '@lingui/react/macro';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';

import { AttributeValuesPanel } from '@/modules/attributes';
import { Button } from '@/shared/ui/button';
import { PageContent } from '@/shared/ui/page';
import { Sheet, SheetContent } from '@/shared/ui/sheet';

import { AttributeDialog } from './AttributeDialog';
import { AttributesTable } from './AttributesTable';

export const AttributesAdminPage = () => {
  const { t } = useLingui();
  const [createDialog, setCreateDialog] = useState<boolean>(false);
  const [selectedAttribute, setSelectedAttribute] = useState<Attribute>();
  const [openAttributeValuesSheet, setOpenAttributeValuesSheet] = useState<boolean>(false);

  return (
    <>
      <PageContent className='space-y-6'>
        <div className='items-start justify-between gap-4 md:flex'>
          <div>
            <h1 className='text-primary text-2xl font-semibold'>{t`Attributes`}</h1>
            <p className='text-muted-foreground mt-1 text-sm'>
              {t`Manage category attributes and reusable values for product variants.`}
            </p>
          </div>
          <Button onClick={() => setCreateDialog(true)}>
            <PlusIcon />
            {t`Create attribute`}
          </Button>
        </div>
        <AttributesTable
          onManageValues={(attribute) => {
            setSelectedAttribute(attribute);
            setOpenAttributeValuesSheet(true);
          }}
        />
        <Sheet onOpenChange={setOpenAttributeValuesSheet} open={openAttributeValuesSheet}>
          <SheetContent className='px-4 sm:max-w-220!'>
            <AttributeValuesPanel attribute={selectedAttribute} />
          </SheetContent>
        </Sheet>
        <AttributeDialog onOpenChange={setCreateDialog} open={createDialog} />
      </PageContent>
    </>
  );
};
