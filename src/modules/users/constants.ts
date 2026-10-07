import type { MessageDescriptor } from '@lingui/core';

import { msg } from '@lingui/core/macro';

export const userRoleLabelMap: Record<UserRole, MessageDescriptor> = {
  admin: msg`Admin`,
  buyer: msg`Buyer`,
  moderator: msg`Moderator`,
  seller: msg`Seller`,
  super_admin: msg`Super admin`
};

export const userRoleOptions = Object.entries(userRoleLabelMap).map(([value, label]) => ({
  value: value as UserRole,
  label
}));

export const userRoleColorMap: Record<UserRole, string> = {
  admin: '#F43F5E',
  buyer: '#22C55E',
  moderator: '#64748B',
  seller: '#6366F1',
  super_admin: '#A855F7'
};
