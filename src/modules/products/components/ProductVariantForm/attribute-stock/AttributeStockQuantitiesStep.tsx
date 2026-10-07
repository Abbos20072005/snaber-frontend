import { useLingui } from '@lingui/react/macro';
import { ArrowLeftIcon } from 'lucide-react';

import { AttributeStockQuantityRow } from '@/modules/products';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';

import type { ProductVariantSchemaForm } from '../constants';
import type { ProductVariantFormApi } from '../types';

interface AttributeStockQuantitiesStepProps {
  attributeStocks: ProductVariantSchemaForm['attribute_stocks'];
  attributesWithValues: Attribute[];
  form: ProductVariantFormApi;
  onBack: () => void;
}

export const AttributeStockQuantitiesStep = ({
  attributeStocks,
  attributesWithValues,
  form,
  onBack
}: AttributeStockQuantitiesStepProps) => {
  const { t } = useLingui();

  return (
    <section className='border-border bg-background grid gap-4 rounded-md border p-4 shadow-xs'>
      <div className='flex flex-wrap items-start justify-between gap-3'>
        <div className='grid gap-1'>
          <h3 className='text-sm font-semibold'>{t`Step 2. Enter quantities`}</h3>
          <p className='text-muted-foreground text-xs'>
            {t`Each generated pair becomes one attribute stock.`}
          </p>
        </div>
        <div className='flex flex-wrap items-center gap-2'>
          <Button size='sm' type='button' variant='outline' onClick={onBack}>
            <ArrowLeftIcon />
            {t`Back`}
          </Button>
          <Badge variant='outline'>
            {attributeStocks.length} {t`generated`}
          </Badge>
        </div>
      </div>

      {attributeStocks.length === 0 && (
        <div className='border-border bg-muted/20 text-muted-foreground rounded-md border border-dashed p-4 text-sm'>
          {t`Select attribute values to generate stock rows.`}
        </div>
      )}

      {attributeStocks.length > 0 && (
        <div className='grid max-h-136 gap-3 overflow-y-auto pr-1'>
          {attributeStocks.map((attributeStock, index) => (
            <AttributeStockQuantityRow
              key={attributeStock.attribute_values
                .map((attributeValue) => attributeValue.value)
                .join('-')}
              attributesWithValues={attributesWithValues}
              index={index}
              attributeStock={attributeStock}
              form={form}
            />
          ))}
        </div>
      )}
    </section>
  );
};
