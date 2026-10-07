import type { MessageDescriptor } from '@lingui/core';

import { msg } from '@lingui/core/macro';

export const MONTHS = [
  msg`January`,
  msg`February`,
  msg`March`,
  msg`April`,
  msg`May`,
  msg`June`,
  msg`July`,
  msg`August`,
  msg`September`,
  msg`October`,
  msg`November`,
  msg`December`
];

export type MonthKey =
  | 'Apr'
  | 'Aug'
  | 'Dec'
  | 'Feb'
  | 'Jan'
  | 'Jul'
  | 'Jun'
  | 'Mar'
  | 'May'
  | 'Nov'
  | 'Oct'
  | 'Sep';

export const monthKeyMap: Record<MonthKey, MessageDescriptor> = {
  Jan: msg`January`,
  Feb: msg`February`,
  Mar: msg`March`,
  Apr: msg`April`,
  May: msg`May`,
  Jun: msg`June`,
  Jul: msg`July`,
  Aug: msg`August`,
  Sep: msg`September`,
  Oct: msg`October`,
  Nov: msg`November`,
  Dec: msg`December`
};
