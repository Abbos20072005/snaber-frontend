import { useLingui } from '@lingui/react/macro';

import type {
  ProductVariantAnyField,
  ProductVariantFormApi,
  ProductVariantSchemaForm
} from '@/modules/products';

import { getAttributeStockValueLabels } from '@/modules/products/';
import { Badge } from '@/shared/ui/badge';

interface Props {
  attributeStock: ProductVariantSchemaForm['attribute_stocks'][number];
  attributesWithValues: Attribute[];
  form: ProductVariantFormApi;
  index: number;
}

export const AttributeStockQuantityRow = ({
  attributeStock,
  attributesWithValues,
  form,
  index
}: Props) => {
  const { t } = useLingui();
  const labels = getAttributeStockValueLabels({
    attributeStock,
    attributesWithValues
  });

  return (
    <div className='border-border/80 bg-muted/10 grid gap-3 rounded-md border p-3 md:grid-cols-[minmax(0,1fr)_11rem] md:items-start'>
      <div className='grid min-w-0 gap-2'>
        <div className='flex items-center gap-2'>
          <Badge variant='secondary'>
            {t`Combination`} {index + 1}
          </Badge>
        </div>
        <div className='flex min-w-0 flex-wrap items-center gap-1.5'>
          {labels.map((label, labelIndex) => (
            <div key={label.key} className='flex min-w-0 items-center gap-1.5'>
              {labelIndex > 0 && <span className='text-muted-foreground text-xs'>+</span>}
              <span className='border-border bg-background inline-flex max-w-52 items-center gap-1.5 rounded-md border px-2 py-1 text-xs'>
                {label.attributeName && (
                  <span className='text-muted-foreground shrink-0'>{label.attributeName}</span>
                )}
                <span className='min-w-0 truncate font-medium'>{label.value}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <form.AppField name={`attribute_stocks.${index}.quantity` as never}>
        {(quantityField: ProductVariantAnyField) => (
          <quantityField.PriceInput isRequired label={t`Quantity`} placeholder='0' />
        )}
      </form.AppField>
    </div>
  );
};
