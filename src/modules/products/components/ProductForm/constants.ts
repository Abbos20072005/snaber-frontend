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

export const productSchemaForm = () =>
  z
    .object({
      category: z.object({
        value: z.string().min(1, t`Category is required`),
        label: z.string()
      }),
      lead_time_max: numberStringSchema(t`Lead time max must be a positive number`),
      lead_time_min: numberStringSchema(t`Lead time min must be a positive number`),
      moq: numberStringSchema(t`MOQ must be a positive number`),
      moq_unit: z.object({
        value: z.string().min(1, t`MOQ unit is required`),
        label: z.string()
      }),
      name_uz: z.string().min(1, t`Name is required`),
      name_en: z.string().min(1, t`Name is required`),
      name_ru: z.string().min(1, t`Name is required`),
      price_max: numberStringSchema(t`Price max must be a positive number`),
      price_min: numberStringSchema(t`Price min must be a positive number`),
      price_type: z.enum(['exact', 'on_request', 'range']),
      product_type: z.enum(['both', 'made_to_order', 'ready']),
      sku: z.string().min(1, t`SKU is required`),
      image: createFileArraySchema()
    })
    .refine((data) => Number(data.lead_time_max) >= Number(data.lead_time_min), {
      path: ['lead_time_max'],
      message: t`Lead time max must be greater than or equal to lead time min`
    })
    .refine((data) => Number(data.lead_time_min) <= Number(data.lead_time_max), {
      path: ['lead_time_min'],
      message: t`Lead time min must be a positive number`
    })
    .refine((data) => Number(data.price_max) >= Number(data.price_min), {
      path: ['price_max'],
      message: t`Price max must be a positive number`
    })
    .refine((data) => Number(data.price_min) <= Number(data.price_max), {
      path: ['price_min'],
      message: t`Price min must be a positive number`
    });

export type ProductSchemaForm = z.infer<ReturnType<typeof productSchemaForm>>;

export const getProductFormDefaultValues = (product?: Partial<Product>): ProductSchemaForm =>
  ({
    category: product?.category
      ? { value: `${product.category.id}`, label: product.category.name }
      : { value: '', label: '' },
    lead_time_max: `${product?.lead_time_max ?? 0}`,
    lead_time_min: `${product?.lead_time_min ?? 0}`,
    moq: `${product?.moq ?? 0}`,
    moq_unit: product?.moq_unit
      ? { value: `${product.moq_unit.id}`, label: product.moq_unit.unit }
      : { value: '', label: '' },
    name_uz: product?.name ?? '',
    name_en: product?.name ?? '',
    name_ru: product?.name ?? '',
    price_max: `${product?.price_max ?? 0}`,
    price_min: `${product?.price_min ?? 0}`,
    price_type: product?.price_type ?? 'exact',
    product_type: product?.product_type ?? 'ready',
    sku: product?.sku ?? '',
    image: []
  }) satisfies ProductSchemaForm;

export const productFormToDto = (values: ProductSchemaForm): ProductDto => ({
  category: Number(values.category.value),
  lead_time_max: Number(values.lead_time_max),
  lead_time_min: Number(values.lead_time_min),
  moq: Number(values.moq),
  moq_unit: Number(values.moq_unit.value),
  name_en: values.name_en,
  name_ru: values.name_ru,
  name_uz: values.name_uz,
  price_max: Number(values.price_max),
  price_min: Number(values.price_min),
  price_type: values.price_type,
  product_type: values.product_type,
  sku: values.sku,
  image: values.image[0]
});
