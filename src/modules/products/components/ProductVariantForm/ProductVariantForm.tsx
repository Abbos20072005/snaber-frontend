import { useLingui } from '@lingui/react/macro';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';

import {
  AttributeStocksField,
  getProductAttributesByCategoryQueryOptions
} from '@/modules/products';
import { useFileFetcher } from '@/shared/hooks/use-file-fetcher';
import { Button } from '@/shared/ui/button';
import { useAppForm } from '@/shared/ui/form/hooks';

import type { ProductVariantSchemaForm } from './constants';

import { BasicFieldsSection } from './BasicFieldsSection';
import { CharacteristicsField } from './CharacteristicsField';
import { getProductVariantFormDefaultValues, productVariantSchemaForm } from './constants';
import { DescriptionFieldsSection } from './DescriptionFieldsSection';
import {
  getAttributesWithValues,
  getAttributeValuesByAttribute,
  getAttributeValuesCount
} from './helpers';
import { MediaField } from './MediaField';
import { VariantAttributesField } from './VariantAttributesField';

interface Props {
  defaultValues?: ProductVariant;
  isLoading?: boolean;
  product: Product;
  productValue?: number;
  onSubmit?: (value: ProductVariantSchemaForm) => void;
}

export const ProductVariantForm = ({
  defaultValues,
  isLoading,
  product,
  productValue,
  onSubmit
}: Props) => {
  const { t } = useLingui();

  const mediaLinks = defaultValues?.medias?.map((media) => media.file) ?? [];

  const {
    files: mediaFiles,
    isError: isMediaError,
    isLoading: isMediaLoading
  } = useFileFetcher({
    links: mediaLinks,
    enabled: mediaLinks.length > 0
  });

  const attributesQuery = useQuery(
    getProductAttributesByCategoryQueryOptions({
      params: { category: product.category.id }
    })
  );

  const attributes = attributesQuery.data?.data ?? [];
  const attributeValuesByAttribute = getAttributeValuesByAttribute(attributes);
  const attributesWithValues = getAttributesWithValues(attributes);
  const attributeValuesCount = getAttributeValuesCount(attributes);
  const formDefaultValues = useMemo(
    () => getProductVariantFormDefaultValues(product, defaultValues, productValue),
    [defaultValues, product, productValue]
  );

  const form = useAppForm({
    validators: {
      onChange: productVariantSchemaForm()
    },
    defaultValues: formDefaultValues,
    onSubmit: ({ value }) => onSubmit?.(value)
  });

  useEffect(() => {
    form.reset(formDefaultValues);
  }, [form, formDefaultValues]);

  useEffect(() => {
    if (mediaLinks.length === 0) return;
    if (isMediaLoading || isMediaError) return;
    if (mediaFiles.length !== mediaLinks.length) return;

    const currentFiles = form.getFieldValue('images');
    const isAlreadySet =
      currentFiles.length === mediaFiles.length &&
      currentFiles.every((file, index) => file === mediaFiles[index]);

    if (!isAlreadySet) form.setFieldValue('images', mediaFiles);
  }, [form, isMediaError, isMediaLoading, mediaFiles, mediaLinks.length]);

  return (
    <form.AppForm>
      <form
        className='grid gap-5'
        id='product-variant-form'
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <BasicFieldsSection form={form} />
        <DescriptionFieldsSection form={form} />
        <MediaField form={form} isMediaLoading={isMediaLoading} />
        <VariantAttributesField
          attributes={attributes}
          attributeValuesByAttribute={attributeValuesByAttribute}
          form={form}
          isAttributesLoading={attributesQuery.isLoading}
        />
        <AttributeStocksField
          attributesWithValues={attributesWithValues}
          attributeValuesByAttribute={attributeValuesByAttribute}
          attributeValuesCount={attributeValuesCount}
          form={form}
          isAttributesLoading={attributesQuery.isLoading}
        />
        <CharacteristicsField form={form} />

        <form.AppField name='is_active'>
          {(field) => <field.Checkbox label={t`Is active`} />}
        </form.AppField>

        <Button
          className='ml-auto w-fit'
          type='submit'
          form='product-variant-form'
          loading={isLoading}
        >
          {t`Save changes`}
        </Button>
      </form>
    </form.AppForm>
  );
};
