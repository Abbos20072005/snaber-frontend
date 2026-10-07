import { useLingui } from '@lingui/react/macro';
import { CheckIcon, XIcon } from 'lucide-react';

import { AttributeValueOption } from '@/modules/products';
import { Button } from '@/shared/ui/button';

interface Props {
  attribute: Attribute;
  attributeValues: AttributeValue[];
  selectedValueIds: Set<string>;
  onAttributeValuesClear: (attribute: Attribute) => void;
  onAttributeValuesSelect: (attribute: Attribute) => void;
  onAttributeValueToggle: (attribute: Attribute, attributeValue: AttributeValue) => void;
}

export const AttributeValueGroup = ({
  attribute,
  attributeValues,
  selectedValueIds,
  onAttributeValueToggle,
  onAttributeValuesClear,
  onAttributeValuesSelect
}: Props) => {
  const { t } = useLingui();
  const selectedAttributeValues = attributeValues.filter((attributeValue) =>
    selectedValueIds.has(`${attributeValue.id}`)
  );

  return (
    <div className='border-border bg-background grid gap-3 rounded-md border p-3'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='min-w-0'>
          <p className='truncate text-sm font-medium'>{attribute.name}</p>
          <p className='text-muted-foreground text-xs'>
            {selectedAttributeValues.length} / {attributeValues.length} {t`selected`}
          </p>
        </div>
        <div className='flex items-center gap-1.5'>
          <Button
            disabled={selectedAttributeValues.length === attributeValues.length}
            size='xs'
            type='button'
            variant='outline'
            onClick={() => onAttributeValuesSelect(attribute)}
          >
            <CheckIcon />
            {t`All`}
          </Button>
          <Button
            disabled={selectedAttributeValues.length === 0}
            size='xs'
            type='button'
            variant='ghost'
            onClick={() => onAttributeValuesClear(attribute)}
          >
            <XIcon />
            {t`Clear`}
          </Button>
        </div>
      </div>

      <div className='grid gap-2 sm:grid-cols-2 xl:grid-cols-3'>
        {attributeValues.map((attributeValue) => (
          <AttributeValueOption
            key={attributeValue.id}
            attribute={attribute}
            attributeValue={attributeValue}
            isSelected={selectedValueIds.has(`${attributeValue.id}`)}
            onAttributeValueToggle={onAttributeValueToggle}
          />
        ))}
      </div>
    </div>
  );
};
