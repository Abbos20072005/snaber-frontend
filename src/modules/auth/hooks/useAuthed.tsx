import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import { logout } from '../lib/logout';
import { getAuthMeQueryOptions } from '../options';

export const useAuthed = () => {
  const getUsersMeQuery = useSuspenseQuery(getAuthMeQueryOptions());
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
