import type { MessageDescriptor } from '@lingui/core';

import { msg, t } from '@lingui/core/macro';
import z from 'zod';

export const companySortLabelMap: Record<SortType, MessageDescriptor> = {
  new: msg`New`,
  old: msg`Old`
};

export const companySortLabelOptions = Object.entries(companySortLabelMap).map(([key, value]) => ({
  value: key as SortType,
  label: value
}));

export const statusLabelMap: Record<Status, MessageDescriptor> = {
  active: msg`Active`,
  blocked: msg`Blocked`,
  draft: msg`Draft`,
  inactive: msg`Inactive`
};

export const statusLabelOptions = Object.entries(statusLabelMap).map(([key, value]) => ({
  value: key as Status,
  label: value
}));

export const statusColorMap: Record<Status, string> = {
  active: '#00A63E',
  blocked: '#E14343',
  draft: '#2F3542',
  inactive: '#6C7483'
};

export const companyFormSchema = () =>
  z.object({
    status: z.enum(['active', 'blocked', 'draft', 'inactive']),
    description_moderator: z.string().min(1, t`Description is required`)
  });

export type CompanyFormSchema = z.infer<ReturnType<typeof companyFormSchema>>;
