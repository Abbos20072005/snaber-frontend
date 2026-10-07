import { useLingui } from '@lingui/react/macro';
import { useSuspenseQuery } from '@tanstack/react-query';

import { CategoryNestedSelect } from '@/modules/category';
import { priceTypeOptions, productTypeOptions } from '@/modules/products';
import { useFileFetcher } from '@/shared/hooks/use-file-fetcher.ts';
import { Button } from '@/shared/ui/button';
import { useAppForm } from '@/shared/ui/form/hooks';
import { Label } from '@/shared/ui/label';
import { SelectItem } from '@/shared/ui/select';

import type { ProductSchemaForm } from './constants';

import { getUnitOfMeasuresQueryOptions } from '../../../unit-of-measure';
import { getProductFormDefaultValues, productSchemaForm } from './constants';

interface Props {
  defaultValues?: Partial<Product>;
  formId?: string;
  isLoading?: boolean;
  submitLabel?: string;
  onSubmit?: (value: ProductSchemaForm) => void;
}

export const ProductForm = ({
  defaultValues,
  formId = 'product-form',
  isLoading,
  submitLabel,
  onSubmit
}: Props) => {
  const { t } = useLingui();

  const unitsQuery = useSuspenseQuery(getUnitOfMeasuresQueryOptions());
  const units = unitsQuery.data.data ?? [];

  const links = defaultValues?.image ? [defaultValues.image] : [];
  const { isLoading: isFileLoading, isError, files } = useFileFetcher({ links });

  const form = useAppForm({
    validators: {
      onChange: productSchemaForm()
    },
    defaultValues: {
      ...getProductFormDefaultValues(defaultValues),
      image: isLoading && !isError ? [] : files
    },
    onSubmit: ({ value }) => onSubmit?.(value)
  });

  return (
    <form.AppForm>
      <form
        className='grid gap-6'
        id={formId}
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <div className='grid gap-4 lg:grid-cols-3'>
          <form.AppField name='name_uz'>
            {(field) => <field.Input isRequired label={`${t`Name`} (UZ)`} placeholder='Olma' />}
          </form.AppField>
          <form.AppField name='name_ru'>
            {(field) => <field.Input isRequired label={`${t`Name`} (RU)`} placeholder='Яблоко' />}
          </form.AppField>
          <form.AppField name='name_en'>
            {(field) => <field.Input isRequired label={`${t`Name`} (EN)`} placeholder='Apple' />}
          </form.AppField>
        </div>
        <div className='grid gap-4 md:grid-cols-3'>
          <form.AppField name='sku'>
            {(field) => <field.Input isRequired label='SKU' placeholder='PRD-001' />}
          </form.AppField>
          <form.AppField name='product_type'>
            {(field) => (
              <field.Select
                isRequired
                items={productTypeOptions.map((item) => ({
                  label: t(item.label),
                  value: item.value
                }))}
                label={t`Product type`}
                placeholder={t`Select type`}
              >
                {productTypeOptions.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {t(item.label)}
                  </SelectItem>
                ))}
              </field.Select>
            )}
          </form.AppField>
          <form.AppField name='price_type'>
            {(field) => (
              <field.Select
                isRequired
                items={priceTypeOptions.map((item) => ({
                  label: t(item.label),
                  value: item.value
                }))}
                label={t`Price type`}
                placeholder={t`Select price type`}
              >
                {priceTypeOptions.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {t(item.label)}
                  </SelectItem>
                ))}
              </field.Select>
            )}
          </form.AppField>
        </div>
        <form.AppField name='image'>
          {(field) => (
            <field.FileUpload
              isRequired
              accept='image/*'
              label={t`Image`}
              maxFiles={1}
              selectText={t`Select image`}
              loading={isFileLoading}
              loadingText={t`Loading image...`}
            />
          )}
        </form.AppField>
        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-5'>
          <form.AppField name='price_min'>
            {(field) => <field.PriceInput isRequired currency='USD' label={t`Price min`} />}
          </form.AppField>
          <form.AppField name='price_max'>
            {(field) => <field.PriceInput isRequired currency='USD' label={t`Price max`} />}
          </form.AppField>
          <form.AppField name='moq'>
            {(field) => <field.PriceInput isRequired label='MOQ' placeholder='0' />}
          </form.AppField>
          <form.AppField name='moq_unit'>
            {(field) => (
              <field.Select
                isRequired
                items={units.map((unit) => ({
                  label: unit.unit,
                  value: `${unit.id}`
                }))}
                disabled={unitsQuery.isLoading}
                label={t`MOQ unit`}
                value={field.state.value.value}
                onValueChange={(value) => {
                  const unit = units.find((item) => `${item.id}` === value);
                  field.handleChange({
                    value: value as string,
                    label: unit?.unit ?? ''
                  });
                }}
                placeholder={t`Select unit`}
              >
                {units.map((unit) => (
                  <SelectItem key={unit.id} value={`${unit.id}`}>
                    {unit.unit}
                  </SelectItem>
                ))}
              </field.Select>
            )}
          </form.AppField>
          <div className='grid grid-cols-2 gap-4'>
            <form.AppField name='lead_time_min'>
              {(field) => <field.PriceInput isRequired label={t`Lead min`} placeholder='0' />}
            </form.AppField>
            <form.AppField name='lead_time_max'>
              {(field) => <field.PriceInput isRequired label={t`Lead max`} placeholder='0' />}
            </form.AppField>
          </div>
        </div>
        <form.AppField name='category'>
          {(field) => (
            <div className='grid gap-2'>
              <Label>{t`Category`}</Label>
              <CategoryNestedSelect
                value={field.state.value}
                onValueChange={(val) => {
                  field.setValue(
                    val ?? {
                      label: '',
                      value: ''
                    }
                  );
                }}
              />
            </div>
          )}
        </form.AppField>
        <Button className='ml-auto w-fit' type='submit' loading={isLoading}>
          {submitLabel ?? t`Save changes`}
        </Button>
      </form>
    </form.AppForm>
  );
};
