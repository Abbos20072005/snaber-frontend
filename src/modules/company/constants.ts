import type { MessageDescriptor } from '@lingui/core';

import { msg, t } from '@lingui/core/macro';
import z from 'zod';

export const companySortLabelMap: Record<SortType, MessageDescriptor> = {
  new: msg`New`,
  old: msg`Old`,
  most_ordered: msg`Most ordered`,
  most_products: msg`Most products`
};

export const companySortLabelOptions = Object.entries(companySortLabelMap).map(([key, value]) => ({
  value: key as SortType,
  label: value
}));

export const companyFormSchema = () =>
  z.object({
    status: z.enum(['active', 'blocked', 'draft', 'inactive']),
    description_moderator: z.string().min(1, t`Description is required`)
  });

export type CompanyFormSchema = z.infer<ReturnType<typeof companyFormSchema>>;
