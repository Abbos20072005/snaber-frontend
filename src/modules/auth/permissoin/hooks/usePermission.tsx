import type { HAS_ACCESS } from '@/modules/auth';

import { hasAccessMap, useAuthed } from '@/modules/auth';

export const usePermission = () => {
  const { user } = useAuthed();

  const hasRole = (roles: Array<UserRole> | UserRole, checkUser: UserRole = user.role): boolean => {
    if (Array.isArray(roles)) return roles.includes(checkUser);

    return user.role === roles;
  };

  const hasAccessTo = (key: HAS_ACCESS, userRole: UserRole = user.role) =>
    hasAccessMap[key].includes(userRole);

  return { hasRole, hasAccessTo };
};
