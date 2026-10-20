import type { MessageDescriptor } from '@lingui/core';

import { msg } from '@lingui/core/macro';

export const userRoleLabelMap: Record<UserRole, MessageDescriptor> = {
  admin: msg`Admin`,
  buyer: msg`Client`
};

export const userRoleOptions = Object.entries(userRoleLabelMap).map(([value, label]) => ({
  value: value as UserRole,
  label
}));

export const userRoleColorMap: Record<UserRole, string> = {
  admin: '#F43F5E',
  buyer: '#22C55E'
};
