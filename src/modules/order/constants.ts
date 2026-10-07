import type { MessageDescriptor } from '@lingui/core';

import { msg } from '@lingui/core/macro';

export const orderStatusColorMap: Record<OrderStatus, string> = {
  accepted: '#22C55E',
  negotiation: '#8B5CF6',
  rejected: '#EF4444'
};

export const orderStatusLabelMap: Record<OrderStatus, MessageDescriptor> = {
  accepted: msg`Accepted`,
  negotiation: msg`Negotiation`,
  rejected: msg`Rejected`
};

export const orderTypeColorMap: Record<OrderType, string> = {
  ready: '#0EA5E9',
  rfq: '#F97316',
  both: '#2516f9'
};

export const orderTypeLabelMap: Record<OrderType, MessageDescriptor> = {
  both: msg`Both`,
  ready: msg`Ready`,
  rfq: msg`RFQ`
};

export const orderTypeLabelOptions = Object.entries(orderTypeLabelMap).map(([key, value]) => ({
  label: value,
  value: key as OrderType
}));
