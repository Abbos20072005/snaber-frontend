import type { MessageDescriptor } from '@lingui/core';

import { msg } from '@lingui/core/macro';

export const BUYER_DASHBOARD_MONTHS = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec'
] as const;

export type BuyerDashboardMonth = (typeof BUYER_DASHBOARD_MONTHS)[number];

export const buyerDashboardMonthLabelMap: Record<BuyerDashboardMonth, MessageDescriptor> = {
  apr: msg`Apr`,
  aug: msg`Aug`,
  dec: msg`Dec`,
  feb: msg`Feb`,
  jan: msg`Jan`,
  jul: msg`Jul`,
  jun: msg`Jun`,
  mar: msg`Mar`,
  may: msg`May`,
  nov: msg`Nov`,
  oct: msg`Oct`,
  sep: msg`Sep`
};
