import type { MessageDescriptor } from '@lingui/core';

import { msg, t } from '@lingui/core/macro';
import z from 'zod';

export const productTypeLabelMap: Record<ProductType, MessageDescriptor> = {
  both: msg`Both`,
  made_to_order: msg`Made to order`,
  ready: msg`Ready`
};

export const productTypeOptions = Object.entries(productTypeLabelMap).map(([value, label]) => ({
  value: value as ProductType,
  label
}));

export const productTypeColorMap: Record<ProductType, string> = {
  both: '#0EA5E9',
  made_to_order: '#F97316',
  ready: '#22C55E'
};

export const priceTypeLabelMap: Record<PriceType, MessageDescriptor> = {
  exact: msg`Exact`,
  on_request: msg`On request`,
  range: msg`Range`
};

export const priceTypeOptions = Object.entries(priceTypeLabelMap).map(([value, label]) => ({
  value: value as PriceType,
  label
}));

export const priceTypeColorMap: Record<PriceType, string> = {
  exact: '#2563EB',
  on_request: '#A855F7',
  range: '#14B8A6'
};

export const productMediaTypeLabelMap: Record<ProductMediaType, MessageDescriptor> = {
  image: msg`Image`,
  video: msg`Video`
};

export const productMediaTypeOptions = Object.entries(productMediaTypeLabelMap).map(
  ([value, label]) => ({
    value: value as ProductMediaType,
    label
  })
);

export const productMediaTypeColorMap: Record<ProductMediaType, string> = {
  image: '#EC4899',
  video: '#EF4444'
};

export const attributeTypeLabelMap: Record<AttributeType, MessageDescriptor> = {
  boolean: msg`Boolean`,
  multiselect: msg`Multi select`,
  number: msg`Number`,
  range: msg`Range`,
  select: msg`Select`,
  text: msg`Text`
};

export const attributeTypeOptions = Object.entries(attributeTypeLabelMap).map(([value, label]) => ({
  value: value as AttributeType,
  label
}));

export const attributeTypeColorMap: Record<AttributeType, string> = {
  boolean: '#84CC16',
  multiselect: '#8B5CF6',
  number: '#F59E0B',
  range: '#06B6D4',
  select: '#3B82F6',
  text: '#64748B'
};

export const productDraftFormSchema = () =>
  z.object({
    status: z.enum(['accepted', 'returned_for_correction', 'draft', 'reviewing']),
    moderator_comment: z.string().min(1, t`Description is required`)
  });

export type ProductDraftFormSchema = z.infer<ReturnType<typeof productDraftFormSchema>>;
