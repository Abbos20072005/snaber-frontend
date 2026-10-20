import { useLingui } from '@lingui/react/macro';
import { useSuspenseQuery } from '@tanstack/react-query';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';

import { CategoryNestedSelect } from '@/modules/category';
import { getUnitOfMeasuresQueryOptions } from '@/modules/unit-of-measure';
import { localeOptions } from '@/shared/i18n/constants';
import { formatPrice } from '@/shared/lib/format';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { useAppForm } from '@/shared/ui/form/hooks';
import { Label } from '@/shared/ui/label';
import { SelectItem } from '@/shared/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { SimpleEditor } from '@/shared/ui/tiptap-editor/simple/simple-editor';

import type { ProductSchemaForm } from './constants';

import { emptyCharacteristic, getProductFormDefaultValues, productSchemaForm } from './constants';
import { ProductAttributesField } from './ProductAttributesField';
import { ProductImagesField } from './ProductImagesField';

interface Props {
  deletingImageId?: number;
  formId?: string;
  isLoading?: boolean;
  product?: Product;
  submitLabel?: string;
  onDeleteImage?: (media: ProductMedia) => void;
  onSubmit: (value: ProductSchemaForm) => void;
}

export const ProductForm = ({
  deletingImageId,
  formId = 'product-form',
  isLoading,
  product,
  submitLabel,
  onDeleteImage,
  onSubmit
}: Props) => {
  const { t } = useLingui();

  const unitsQuery = useSuspenseQuery(getUnitOfMeasuresQueryOptions());
  const units = unitsQuery.data.data ?? [];

  const form = useAppForm({
    validators: {
      onChange: productSchemaForm()
    },
    defaultValues: getProductFormDefaultValues(product),
    onSubmit: ({ value }) => onSubmit(value),
    onSubmitInvalid: () => {
      toast.error(t`Please fill in the required fields.`);
      // Required fields can be far from the submit button, so bring the first broken one into view.
      document
        .querySelector('#product-form [aria-invalid="true"]')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
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
        <Card>
          <CardHeader>
            <CardTitle>{t`Basic information`}</CardTitle>
            <CardDescription>{t`Where the product is shown in the catalog.`}</CardDescription>
          </CardHeader>
          <CardContent className='grid gap-4'>
            <form.AppField name='category'>
              {(field) => (
                <div className='grid gap-2'>
                  <Label>
                    {t`Category`} <span className='text-destructive'>*</span>
                  </Label>
                  <CategoryNestedSelect
                    value={field.state.value}
                    onValueChange={(val) => {
                      field.setValue(val ?? { label: '', value: '' });
                      // Filters belong to the category, so the old picks no longer apply.
                      form.setFieldValue('attribute_values', []);
                    }}
                  />
                  <form.Subscribe selector={(state) => state.submissionAttempts}>
                    {(attempts) =>
                      attempts > 0 && !field.state.value.value ? (
                        <p aria-invalid className='text-destructive text-xs'>
                          {t`Category is required`}
                        </p>
                      ) : (
                        <p className='text-muted-foreground text-xs'>
                          {t`Choose the last-level category, the one that lists products.`}
                        </p>
                      )
                    }
                  </form.Subscribe>
                </div>
              )}
            </form.AppField>
            <div className='grid gap-4 md:grid-cols-3'>
              <form.AppField name='unit'>
                {(field) => (
                  <field.Select
                    items={units.map((unit) => ({ label: unit.unit, value: `${unit.id}` }))}
                    label={t`Unit`}
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
              <form.AppField name='sku'>
                {(field) => <field.Input label='SKU' placeholder='PRD-001' />}
              </form.AppField>
              <form.AppField name='is_active'>
                {(field) => <field.Checkbox label={t`Show in the catalog`} />}
              </form.AppField>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t`Price and stock`}</CardTitle>
          </CardHeader>
          <CardContent className='grid gap-4 md:grid-cols-4'>
            <form.AppField name='price'>
              {(field) => <field.PriceInput isRequired label={t`Price`} />}
            </form.AppField>
            <form.AppField name='discount_percent'>
              {(field) => <field.PriceInput label={t`Discount (%)`} placeholder='0' />}
            </form.AppField>
            <form.AppField name='stock_quantity'>
              {(field) => <field.PriceInput isRequired label={t`Stock`} placeholder='0' />}
            </form.AppField>
            <form.Subscribe
              selector={(state) => [state.values.price, state.values.discount_percent]}
            >
              {([price, discount]) => (
                <div className='grid content-end gap-1'>
                  <Label>{t`Final price`}</Label>
                  <p className='text-primary h-9 content-center text-lg font-semibold'>
                    {formatPrice(Number(price || 0) * (1 - Number(discount || 0) / 100))}
                  </p>
                </div>
              )}
            </form.Subscribe>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t`Images`}</CardTitle>
            <CardDescription>{t`The first image is the cover shown in the catalog.`}</CardDescription>
          </CardHeader>
          <CardContent className='grid gap-4'>
            <ProductImagesField
              deletingId={deletingImageId}
              medias={product?.medias ?? []}
              onDelete={(media) => onDeleteImage?.(media)}
            />
            <form.AppField name='images'>
              {(field) => (
                <field.FileUpload
                  multiple
                  accept='image/*'
                  label={product ? t`Add images` : t`Images`}
                  maxFiles={10}
                  selectText={t`Select images`}
                />
              )}
            </form.AppField>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t`Content`}</CardTitle>
            <CardDescription>
              {t`Fill in Uzbek. Russian and English default to it until you translate them.`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue='uz'>
              <TabsList>
                {localeOptions.map((item) => (
                  <TabsTrigger key={item.value} value={item.value}>
                    {item.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {localeOptions.map(({ value: locale }) => (
                <TabsContent key={locale} className='grid gap-4 pt-4' value={locale}>
                  <form.AppField name={`name_${locale}`}>
                    {(field) => (
                      <field.Input
                        isRequired={locale === 'uz'}
                        label={t`Name`}
                        placeholder='Sement M400'
                      />
                    )}
                  </form.AppField>
                  <form.AppField name={`description_${locale}`}>
                    {(field) => (
                      <div className='grid gap-2'>
                        <Label>{t`Description`}</Label>
                        <SimpleEditor
                          content={field.state.value}
                          onChange={(html) => field.handleChange(html)}
                        />
                      </div>
                    )}
                  </form.AppField>
                  <form.Field name='characteristics' mode='array'>
                    {(arrayField) => (
                      <div className='grid gap-3'>
                        <div className='flex items-center justify-between'>
                          <Label>{t`Characteristics`}</Label>
                          <Button
                            size='sm'
                            type='button'
                            variant='outline'
                            onClick={() => arrayField.pushValue(emptyCharacteristic())}
                          >
                            <PlusIcon />
                            {t`Add characteristic`}
                          </Button>
                        </div>
                        {arrayField.state.value.map((_, index) => (
                          <div
                            key={index}
                            className='grid grid-cols-[1fr_1fr_auto] items-end gap-2'
                          >
                            <form.AppField name={`characteristics[${index}].name_${locale}`}>
                              {(field) => <field.Input label={t`Name`} placeholder={t`Weight`} />}
                            </form.AppField>
                            <form.AppField name={`characteristics[${index}].value_${locale}`}>
                              {(field) => <field.Input label={t`Value`} placeholder='50 kg' />}
                            </form.AppField>
                            <Button
                              aria-label={t`Delete`}
                              size='icon'
                              type='button'
                              variant='destructiveOutline'
                              onClick={() => void arrayField.removeValue(index)}
                            >
                              <Trash2Icon />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </form.Field>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <form.Subscribe selector={(state) => state.values.category.value}>
          {(categoryId) =>
            categoryId && (
              <Card>
                <CardHeader>
                  <CardTitle>{t`Filters`}</CardTitle>
                  <CardDescription>{t`Optional. Helps customers find the product.`}</CardDescription>
                </CardHeader>
                <CardContent>
                  <form.AppField name='attribute_values'>
                    {(field) => (
                      <ProductAttributesField
                        value={field.state.value}
                        categoryId={categoryId}
                        onChange={field.handleChange}
                      />
                    )}
                  </form.AppField>
                </CardContent>
              </Card>
            )
          }
        </form.Subscribe>

        <Button className='ml-auto w-fit' type='submit' loading={isLoading}>
          {submitLabel ?? t`Save changes`}
        </Button>
      </form>
    </form.AppForm>
  );
};
