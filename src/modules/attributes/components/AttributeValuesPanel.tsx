import { useLingui } from '@lingui/react/macro';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';

import { AttributeValueDialog, AttributeValuesTable } from '@/modules/attributes';
import { Button } from '@/shared/ui/button';
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/shared/ui/empty';

interface AttributeValuesPanelProps {
  attribute?: Attribute;
}

export const AttributeValuesPanel = ({ attribute }: AttributeValuesPanelProps) => {
  const { t } = useLingui();
  const [createDialog, setCreateDialog] = useState(false);

  if (!attribute) {
    return (
      <Empty className='bg-muted/20 border py-10'>
        <EmptyHeader>
          <EmptyTitle>{t`Select an attribute`}</EmptyTitle>
          <EmptyDescription>
            {t`Use the actions menu in the attributes table to manage values for a specific attribute.`}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className='px-2 py-4'>
      <div className='flex items-center justify-between'>
        <div className='mb-2'>
          <p className='text-primary text-lg font-semibold'>
            {t`Values for`} {attribute.name}
          </p>
          <p className='text-muted-foreground'>{t`Create and manage allowed values for this attribute.`}</p>
        </div>
        <Button onClick={() => setCreateDialog(true)}>
          <PlusIcon />
          {t`Add value`}
        </Button>
      </div>
      <div>
        <AttributeValuesTable
          request={{
            params: {
              attribute: attribute.id
            }
          }}
          enabled={!!attribute}
        />
      </div>
      <AttributeValueDialog onOpenChange={setCreateDialog} open={createDialog} />
    </div>
  );
};
