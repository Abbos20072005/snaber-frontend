import { useQuery, useQueryClient } from '@tanstack/react-query';

import { COOKIES } from '@/shared/constants';
import { isomorphicCookie } from '@/shared/lib/isomorphic-cookie.ts';

import { logout } from '../lib/logout';
import { getAuthMeQueryOptions } from '../options';

export const useAuth = () => {
  const getUsersMeQuery = useQuery({
    enabled: !!isomorphicCookie.get(COOKIES.ACCESS_TOKEN),
    ...getAuthMeQueryOptions()
  });

  const queryClient = useQueryClient();

  const user = getUsersMeQuery.data;

  const onLogout = () => {
    logout(queryClient);
  };

  return {
    user,
    onLogout
  };
};
