import { useLingui } from '@lingui/react/macro';

import type { ProductVariantAnyField, ProductVariantFormApi } from './types';

interface DescriptionFieldsSectionProps {
  form: ProductVariantFormApi;
}

export const DescriptionFieldsSection = ({ form }: DescriptionFieldsSectionProps) => {
  const { t } = useLingui();

  return (
    <div className='grid gap-4 md:grid-cols-3'>
      <form.AppField name='description_uz'>
        {(field: ProductVariantAnyField) => (
          <field.Textarea
            label={`${t`Description`} (UZ)`}
            placeholder={`${t`Description`} (UZ)`}
            rows={3}
          />
        )}
      </form.AppField>
      <form.AppField name='description_ru'>
        {(field: ProductVariantAnyField) => (
          <field.Textarea
            label={`${t`Description`} (RU)`}
            placeholder={`${t`Description`} (RU)`}
            rows={3}
          />
        )}
      </form.AppField>
      <form.AppField name='description_en'>
        {(field: ProductVariantAnyField) => (
          <field.Textarea
            label={`${t`Description`} (EN)`}
            placeholder={`${t`Description`} (EN)`}
            rows={3}
          />
        )}
      </form.AppField>
    </div>
  );
};
