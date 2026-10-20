import type { MessageDescriptor } from '@lingui/core';

import { msg } from '@lingui/core/macro';

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
