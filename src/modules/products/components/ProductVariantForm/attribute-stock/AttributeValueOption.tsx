import { CheckIcon } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

interface Props {
  attribute: Attribute;
  attributeValue: AttributeValue;
  isSelected: boolean;
  onAttributeValueToggle: (attribute: Attribute, attributeValue: AttributeValue) => void;
}

export const AttributeValueOption = ({
  attribute,
  attributeValue,
  isSelected,
  onAttributeValueToggle
}: Props) => {
  return (
    <button
      className={cn(
        'border-border bg-background hover:bg-muted/60 flex min-h-10 w-full items-center justify-between gap-2 rounded-md border px-3 py-2 text-left text-sm transition-colors',
        'focus-visible:border-ring focus-visible:ring-ring/50 outline-none focus-visible:ring-3',
        isSelected && 'border-primary/60 bg-primary/10 text-primary hover:bg-primary/15'
      )}
      aria-pressed={isSelected}
      type='button'
      onClick={() => onAttributeValueToggle(attribute, attributeValue)}
    >
      <span className='min-w-0 truncate'>{attributeValue.value}</span>
      <span
        className={cn(
          'border-border grid size-5 shrink-0 place-items-center rounded-full border',
          isSelected && 'border-primary bg-primary text-primary-foreground'
        )}
      >
        {isSelected && <CheckIcon className='size-3' />}
      </span>
    </button>
  );
};
