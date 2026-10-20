import { t } from '@lingui/core/macro';
import { z } from 'zod';

import { createFileArraySchema } from '@/shared/constants/helperSchemas';

const numberStringSchema = (message: string) =>
  z
    .string()
    .min(1, message)
    .refine((value) => Number(value) >= 0, {
      message
    });

const characteristicSchema = z.object({
  name_en: z.string(),
  name_ru: z.string(),
  name_uz: z.string(),
  value_en: z.string(),
  value_ru: z.string(),
  value_uz: z.string()
});

export const productSchemaForm = () =>
  z.object({
    attribute_values: z.array(z.number()),
    category: z.object({
      value: z.string().min(1, t`Category is required`),
      label: z.string()
    }),
    characteristics: z.array(characteristicSchema),
    description_en: z.string(),
    description_ru: z.string(),
    description_uz: z.string(),
    discount_percent: numberStringSchema(t`Discount must be between 0 and 100`).refine(
      (value) => Number(value) <= 100,
      { message: t`Discount must be between 0 and 100` }
    ),
    images: createFileArraySchema(),
    is_active: z.boolean(),
    name_en: z.string(),
    name_ru: z.string(),
    name_uz: z.string().min(1, t`Name is required`),
    price: numberStringSchema(t`Price must be a positive number`),
    sku: z.string(),
    stock_quantity: numberStringSchema(t`Stock must be a positive number`),
    unit: z.string()
  });

export type ProductSchemaForm = z.infer<ReturnType<typeof productSchemaForm>>;

export type ProductCharacteristicForm = ProductSchemaForm['characteristics'][number];

export const emptyCharacteristic = (): ProductCharacteristicForm => ({
  name_en: '',
  name_ru: '',
  name_uz: '',
  value_en: '',
  value_ru: '',
  value_uz: ''
});

export const getProductFormDefaultValues = (product?: Product): ProductSchemaForm => ({
  attribute_values: product?.attributes.map((attribute) => attribute.value.id) ?? [],
  category: product
    ? { value: `${product.category.id}`, label: product.category.name }
    : { value: '', label: '' },
  characteristics:
    product?.characteristics.map(({ name_en, name_ru, name_uz, value_en, value_ru, value_uz }) => ({
      name_en,
      name_ru,
      name_uz,
      value_en,
      value_ru,
      value_uz
    })) ?? [],
  description_en: product?.description_en ?? '',
  description_ru: product?.description_ru ?? '',
  description_uz: product?.description_uz ?? '',
  discount_percent: `${product?.discount_percent ?? 0}`,
  images: [],
  is_active: product?.is_active ?? true,
  name_en: product?.name_en ?? '',
  name_ru: product?.name_ru ?? '',
  name_uz: product?.name_uz ?? '',
  price: product ? `${Number(product.price)}` : '',
  sku: product?.sku ?? '',
  stock_quantity: `${product?.stock_quantity ?? 0}`,
  unit: product?.unit ? `${product.unit.id}` : ''
});

export const productFormToDto = (values: ProductSchemaForm): ProductDto => ({
  attribute_values: values.attribute_values,
  category: Number(values.category.value),
  // Rows the manager left half empty are dropped instead of failing the whole form.
  characteristics: values.characteristics.filter(
    (item) => item.name_uz.trim() && item.value_uz.trim()
  ),
  description_en: values.description_en,
  description_ru: values.description_ru,
  description_uz: values.description_uz,
  discount_percent: Number(values.discount_percent),
  is_active: values.is_active,
  name_en: values.name_en,
  name_ru: values.name_ru,
  name_uz: values.name_uz,
  price: Number(values.price),
  sku: values.sku,
  stock_quantity: Number(values.stock_quantity),
  unit: values.unit ? Number(values.unit) : null
});
