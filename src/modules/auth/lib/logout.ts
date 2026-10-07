import type { QueryClient } from '@tanstack/react-query';

import { COOKIES } from '@/shared/constants';
import { isomorphicCookie } from '@/shared/lib/isomorphic-cookie.ts';

export const clearAuthCookies = () => {
  isomorphicCookie.delete(COOKIES.ACCESS_TOKEN);
  isomorphicCookie.delete(COOKIES.REFRESH_TOKEN);
  isomorphicCookie.delete(COOKIES.CURRENT_USER);
};

export const redirectToHomeWithReload = () => {
  if (typeof window === 'undefined') return;

  if (window.location.pathname === '/' && !window.location.search && !window.location.hash) {
    window.location.reload();
    return;
  }

  window.location.assign('/');
};

export const logout = (queryClient: QueryClient) => {
  clearAuthCookies();

  queryClient.clear();
  redirectToHomeWithReload();
};
