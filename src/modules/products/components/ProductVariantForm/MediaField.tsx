import { useLingui } from '@lingui/react/macro';

import type { ProductVariantAnyField, ProductVariantFormApi } from './types';

interface MediaFieldProps {
  form: ProductVariantFormApi;
  isMediaLoading: boolean;
}

export const MediaField = ({ form, isMediaLoading }: MediaFieldProps) => {
  const { t } = useLingui();

  return (
    <form.AppField name='images'>
      {(field: ProductVariantAnyField) => (
        <field.FileUpload
          multiple
          accept='image/*,video/*'
          label={t`Media`}
          maxFiles={8}
          selectText={t`Select media`}
          loading={isMediaLoading}
          loadingText={t`Loading media...`}
        />
      )}
    </form.AppField>
  );
};
