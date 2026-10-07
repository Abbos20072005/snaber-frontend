import { useLingui } from '@lingui/react/macro';

import type { ProductVariantAnyField, ProductVariantFormApi } from './types';

interface BasicFieldsSectionProps {
  form: ProductVariantFormApi;
}

export const BasicFieldsSection = ({ form }: BasicFieldsSectionProps) => {
  const { t } = useLingui();

  return (
    <div className='grid gap-4 md:grid-cols-2'>
      <form.AppField name='sku_variant'>
        {(field: ProductVariantAnyField) => <field.Input isRequired label={t`Variant SKU`} />}
      </form.AppField>
      <form.AppField name='stock_quantity'>
        {(field: ProductVariantAnyField) => (
          <field.PriceInput isRequired label={t`Stock quantity`} placeholder='0' />
        )}
      </form.AppField>
      <form.AppField name='price_override'>
        {(field: ProductVariantAnyField) => (
          <field.PriceInput isRequired currency='USD' label={t`Price override`} />
        )}
      </form.AppField>
      <form.AppField name='moq_override'>
        {(field: ProductVariantAnyField) => (
          <field.PriceInput isRequired label={t`MOQ override`} placeholder='0' />
        )}
      </form.AppField>
    </div>
  );
};
