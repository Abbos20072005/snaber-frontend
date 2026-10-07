import { useLingui } from '@lingui/react/macro';
import { ArrowRightIcon } from 'lucide-react';

import { AttributeValueGroup } from '@/modules/products';
import { Button } from '@/shared/ui/button';

interface Props {
  attributesWithValues: Attribute[];
  attributeValuesByAttribute: Map<number, AttributeValue[]>;
  attributeValuesCount: number;
  isAttributesLoading: boolean;
  selectedValueIds: Set<string>;
  selectedValuesCount: number;
  onAttributeValuesClear: (attribute: Attribute) => void;
  onAttributeValuesSelect: (attribute: Attribute) => void;
  onAttributeValueToggle: (attribute: Attribute, attributeValue: AttributeValue) => void;
  onContinue: () => void;
}

export const AttributeStockValuesStep = ({
  attributeValuesByAttribute,
  attributeValuesCount,
  attributesWithValues,
  isAttributesLoading,
  selectedValueIds,
  selectedValuesCount,
  onAttributeValueToggle,
  onAttributeValuesClear,
  onAttributeValuesSelect,
  onContinue
}: Props) => {
  const { t } = useLingui();

  return (
    <section className='border-border bg-background grid gap-4 rounded-md border p-4 shadow-xs'>
      <div className='flex flex-wrap items-start justify-between gap-3'>
        <div className='grid gap-1'>
          <h3 className='text-sm font-semibold'>{t`Step 1. Select values`}</h3>
          <p className='text-muted-foreground text-xs'>
            {t`Choose every value that can be stocked for this variant.`}
          </p>
        </div>
        <Button
          disabled={selectedValuesCount === 0}
          size='sm'
          type='button'
          variant='primaryOutline'
          onClick={onContinue}
        >
          {t`Continue`}
          <ArrowRightIcon />
        </Button>
      </div>

      <div className='border-border/70 bg-muted/10 max-h-136 overflow-y-auto rounded-md border p-3'>
        {isAttributesLoading && (
          <p className='text-muted-foreground text-sm'>{t`Loading attributes...`}</p>
        )}
        {!isAttributesLoading && attributesWithValues.length === 0 && (
          <p className='text-muted-foreground text-sm'>{t`No attribute values available.`}</p>
        )}
        {!isAttributesLoading && attributeValuesCount > 0 && (
          <div className='grid gap-3'>
            {attributesWithValues.map((attribute) => (
              <AttributeValueGroup
                key={attribute.id}
                attribute={attribute}
                attributeValues={attributeValuesByAttribute.get(attribute.id) ?? []}
                selectedValueIds={selectedValueIds}
                onAttributeValuesClear={onAttributeValuesClear}
                onAttributeValuesSelect={onAttributeValuesSelect}
                onAttributeValueToggle={onAttributeValueToggle}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
