import type { MessageDescriptor } from '@lingui/core';

import { msg } from '@lingui/core/macro';

export const weekDaysLabelMap: Record<WeekDay, MessageDescriptor> = {
  Monday: msg`Monday`,
  Tuesday: msg`Tuesday`,
  Wednesday: msg`Wednesday`,
  Thursday: msg`Thursday`,
  Friday: msg`Friday`,
  Saturday: msg`Saturday`,
  Sunday: msg`Sunday`
};

export const weekDaysLabelOptions = Object.entries(weekDaysLabelMap).map(([value, label]) => ({
  value: value as WeekDay,
  label
}));
