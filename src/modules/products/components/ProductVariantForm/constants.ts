import { z } from 'zod';

import { createFileArraySchema } from '@/shared/constants/helperSchemas';

const numberStringSchema = () =>
  z
    .string()
    .min(1)
    .refine((value) => Number(value) >= 0);

export const productVariantSchemaForm = () =>
  z.object({
    description_uz: z.string().optional(),
    description_ru: z.string().optional(),
    description_en: z.string().optional(),
    images: createFileArraySchema(),
    is_active: z.boolean(),
    moq_override: numberStringSchema(),
    price_override: numberStringSchema(),
    product: z.object({
      value: z.string().min(1),
      label: z.string()
    }),
    sku_variant: z.string().min(1),
    stock_quantity: numberStringSchema(),
    attributes: z.array(
      z.object({
        attribute: z.object({
          value: z.string().min(1),
          label: z.string()
        }),
        value: z.string().min(1)
      })
    ),
    attribute_stocks: z.array(
      z.object({
        attribute_values: z
          .array(
            z.object({
              value: z.string().min(1),
              label: z.string()
            })
          )
          .min(1),
        quantity: numberStringSchema()
      })
    ),
    characteristics: z.array(
      z.object({
        name: z.string().min(1),
        value: z.string().min(1)
      })
    )
  });

export type ProductVariantSchemaForm = z.infer<ReturnType<typeof productVariantSchemaForm>>;

export const getProductVariantFormDefaultValues = (
  product: Product,
  variant?: ProductVariant,
  productValue = product.product_id
): ProductVariantSchemaForm =>
  ({
    description_en: variant?.description_en ?? '',
    description_ru: variant?.description_ru ?? '',
    description_uz: variant?.description_uz ?? '',
    images: [],
    is_active: !!variant?.is_active,
    moq_override: `${variant?.moq_override ?? product.moq}`,
    price_override: String(variant?.price_override || product.price_min || product.price_max),
    product: {
      value: String(productValue),
      label: product.name
    },
    sku_variant: variant?.sku_variant ?? `${product.sku}-V${product.variants.length + 1}`,
    stock_quantity: `${variant?.stock_quantity ?? 0}`,
    attributes:
      variant?.attributes.map((item) => ({
        attribute: {
          value: `${item.id}`,
          label: item.name
        },
        value: `${item.value.id}`
      })) ?? [],
    attribute_stocks:
      variant?.attribute_stocks?.map((item) => ({
        attribute_values: item.attribute_values.map((attributeValue) => ({
          value: `${attributeValue.id}`,
          label: attributeValue.value
        })),
        quantity: `${item.quantity}`
      })) ?? [],
    characteristics:
      variant?.characteristics.map((item) => ({
        name: item.name,
        value: item.value
      })) ?? []
  }) satisfies ProductVariantSchemaForm;

export const productVariantFormToDto = (values: ProductVariantSchemaForm): ProductVariantDto => ({
  description_en: values.description_en ?? '',
  description_ru: values.description_ru ?? '',
  description_uz: values.description_uz ?? '',
  images: values.images,
  is_active: values.is_active,
  moq_override: Number(values.moq_override),
  price_override: Number(values.price_override),
  product: Number(values.product.value),
  product_constructor: Number(values.product.value),
  sku_variant: values.sku_variant,
  stock_quantity: Number(values.stock_quantity),
  attribute_stocks: values.attribute_stocks.map((item) => ({
    attribute_values: item.attribute_values.map((attributeValue) => Number(attributeValue.value)),
    quantity: Number(item.quantity)
  })),
  attributes: values.attributes.map((item) => ({
    attribute: Number(item.attribute.value),
    value: Number(item.value)
  })),
  characteristics: values.characteristics
});

export const productVariantFormToFormData = (values: ProductVariantSchemaForm) => {
  const formData = new FormData();

  formData.append('description_en', values.description_en ?? '');
  formData.append('description_ru', values.description_ru ?? '');
  formData.append('description_uz', values.description_uz ?? '');
  formData.append('is_active', `${values.is_active}`);
  formData.append('moq_override', values.moq_override);
  formData.append('price_override', values.price_override);
  formData.append('sku_variant', values.sku_variant);
  formData.append('stock_quantity', values.stock_quantity);

  values.images.forEach((image) => {
    formData.append('images', image);
  });

  formData.append(
    'attributes',
    JSON.stringify(
      values.attributes.map((attribute) => ({
        attribute: Number(attribute.attribute.value),
        value: Number(attribute.value)
      }))
    )
  );

  formData.append(
    'characteristics',
    JSON.stringify(
      values.characteristics.map((characteristic) => ({
        name: characteristic.name,
        value: characteristic.value
      }))
    )
  );

  formData.append(
    'attribute_stocks',
    JSON.stringify(
      values.attribute_stocks.map((stock) => ({
        attribute_values: stock.attribute_values.map((attributeValue) =>
          Number(attributeValue.value)
        ),
        quantity: Number(stock.quantity)
      }))
    )
  );

  return formData;
};
