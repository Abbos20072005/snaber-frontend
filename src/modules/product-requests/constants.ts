import type { MessageDescriptor } from '@lingui/core';
import type { ComponentProps } from 'react';

import { msg } from '@lingui/core/macro';

import type { Badge } from '@/shared/ui/badge';

export const productRequestStatusLabelMap: Record<ProductRequestStatus, MessageDescriptor> = {
  new: msg`New`,
  in_progress: msg`In progress`,
  done: msg`Done`
};

export const productRequestStatusOptions = Object.entries(productRequestStatusLabelMap).map(
  ([value, label]) => ({
    value: value as ProductRequestStatus,
    label
  })
);

export const productRequestStatusVariantMap: Record<
  ProductRequestStatus,
  ComponentProps<typeof Badge>['variant']
> = {
  new: 'default',
  in_progress: 'secondary',
  done: 'success'
};
