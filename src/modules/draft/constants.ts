import type { MessageDescriptor } from '@lingui/core';

import { msg } from '@lingui/core/macro';

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

export const productDraftStatusLabelMap: Record<ProductDraftStatus, MessageDescriptor> = {
  accepted: msg`Accepted`,
  moderation: msg`Moderation`,
  returned_for_correction: msg`Returned for correction`,
  reviewing: msg`Reviewing`
};

export const productDraftStatusLabelOptions = Object.entries(productDraftStatusLabelMap).map(
  ([key, value]) => ({
    value: key as ProductDraftStatus,
    label: value
  })
);

export const productDraftStatusColorMap: Record<ProductDraftStatus, string> = {
  accepted: '#00A63E',
  moderation: '#2F3542',
  returned_for_correction: '#E14343',
  reviewing: '#F59E0B'
};
