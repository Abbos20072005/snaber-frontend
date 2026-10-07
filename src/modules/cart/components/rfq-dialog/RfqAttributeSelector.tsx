import { useLingui } from '@lingui/react/macro';

import { cn } from '@/shared/lib/utils.ts';
import { Input } from '@/shared/ui/input.tsx';

import { mergeAttributeValues } from './helpers.ts';

interface RfqAttributeSelectorProps {
  attributes: NonNullable<CartItemDto['attributes']>;
  variant: ProductVariant;
  onAttributesChange: (attributes: NonNullable<CartItemDto['attributes']>) => void;
}

export const RfqAttributeSelector = ({
  attributes,
  variant,
  onAttributesChange
}: RfqAttributeSelectorProps) => {
  const { t } = useLingui();

  const mergedAttributes = mergeAttributeValues(variant.attribute_stocks, variant.attributes);

  if (mergedAttributes.length === 0) {
    return null;
  }

  const getEntry = (attributeId: number) =>
    attributes.find((attr) => attr.attribute === attributeId);

  const isCustomSelected = (attributeId: number) => {
    const entry = getEntry(attributeId);
    return entry !== undefined && 'value' in entry;
  };

  const handleOptionSelect = (attributeId: number, valueId: number) => {
    onAttributesChange(
      attributes.map((attr) =>
        attr.attribute === attributeId ? { attribute: attributeId, value_option: valueId } : attr
      )
    );
  };

  const handleCustomSelect = (attributeId: number) => {
    onAttributesChange(
      attributes.map((attr) =>
        attr.attribute === attributeId ? { attribute: attributeId, value: '' } : attr
      )
    );
  };

  const handleCustomValueChange = (attributeId: number, value: string) => {
    onAttributesChange(
      attributes.map((attr) =>
        attr.attribute === attributeId ? { attribute: attributeId, value } : attr
      )
    );
  };

  return (
    <div className='flex flex-col gap-3'>
      {mergedAttributes.map((attr) => {
        const entry = getEntry(attr.id);
        const isCustom = isCustomSelected(attr.id);

        return (
          <div key={attr.id} className='flex flex-col gap-1.5'>
            <p className='text-sm font-medium'>{attr.name}:</p>
            <div className='flex flex-wrap gap-2'>
              {attr.values.map((value) => {
                const isSelected =
                  !isCustom && entry && 'value_option' in entry && entry.value_option === value.id;

                return (
                  <button
                    key={value.id}
                    className={cn(
                      'hover:border-primary/60 hover:bg-primary/5 inline-flex max-w-full items-center rounded-md border px-3 py-2 text-sm font-medium transition',
                      isSelected && 'border-primary bg-primary/10 text-primary'
                    )}
                    type='button'
                    onClick={() => handleOptionSelect(attr.id, value.id)}
                  >
                    {value.value}
                  </button>
                );
              })}

              <button
                className={cn(
                  'hover:border-primary/60 hover:bg-primary/5 inline-flex max-w-full items-center rounded-md border px-3 py-2 text-sm font-medium transition',
                  isCustom && 'border-primary bg-primary/10 text-primary'
                )}
                type='button'
                onClick={() => handleCustomSelect(attr.id)}
              >
                {t`Other`}
              </button>
            </div>

            {isCustom && (
              <Input
                value={(entry as { attribute: number; value: string }).value}
                autoFocus
                onChange={(e) => handleCustomValueChange(attr.id, e.target.value)}
                placeholder={t`Enter custom value…`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
