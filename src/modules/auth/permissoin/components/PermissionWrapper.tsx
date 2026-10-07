import type { ReactNode } from 'react';

import { usePermission } from '@/modules/auth/permissoin';

interface Props {
  allowedRoles?: Array<UserRole> | UserRole;
  children: ReactNode;
  fallback?: ReactNode;
}

export const PermissionWrapper = ({ allowedRoles, children, fallback = null }: Props) => {
  const { hasRole } = usePermission();

  if (!allowedRoles) return children;

  if (hasRole(allowedRoles)) return children;

  return fallback;
};
