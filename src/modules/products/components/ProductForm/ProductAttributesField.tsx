import { useLingui } from '@lingui/react/macro';
import { useQuery } from '@tanstack/react-query';

import { getPublicFilterQueryOptions } from '@/modules/attributes';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/badge';
import { Label } from '@/shared/ui/label';

interface Props {
  categoryId: string;
  value: number[];
  onChange: (value: number[]) => void;
}

// Optional storefront filters: the manager just taps the values that fit the product.
export const ProductAttributesField = ({ categoryId, value, onChange }: Props) => {
  const { t } = useLingui();

  const filterQuery = useQuery({
    ...getPublicFilterQueryOptions({ params: { category: categoryId } }),
    enabled: !!categoryId
  });
  const attributes = filterQuery.data?.data.attributes ?? [];

  if (!categoryId || attributes.length === 0) return null;

  const toggle = (valueId: number) =>
    onChange(value.includes(valueId) ? value.filter((id) => id !== valueId) : [...value, valueId]);

  return (
    <div className='grid gap-4'>
      {attributes.map((attribute) => (
        <div key={attribute.id} className='grid gap-2'>
          <Label>{attribute.name}</Label>
          <div className='flex flex-wrap gap-2'>
            {attribute.values.map((item) => {
              const isSelected = value.includes(item.id);

              return (
                <button key={item.id} type='button' onClick={() => toggle(item.id)}>
                  <Badge
                    className={cn('cursor-pointer', isSelected || 'font-normal')}
                    variant={isSelected ? 'default' : 'outline'}
                  >
                    {item.value}
                  </Badge>
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <p className='text-muted-foreground text-xs'>
        {t`Selected values are used by the filters in the catalog.`}
      </p>
    </div>
  );
};
