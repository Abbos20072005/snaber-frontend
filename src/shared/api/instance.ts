import { getRequestHeader } from '@tanstack/react-start/server';
import axios from 'axios';

import { COOKIES, CROSS_SITE_COOKIE_OPTIONS } from '@/shared/constants';
import { isomorphicCookie } from '@/shared/lib/isomorphic-cookie.ts';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  withCredentials: true,
  baseURL: API_URL
});

const apiWithoutAuth = axios.create({
  withCredentials: true,
  baseURL: API_URL
});

// During SSR the browser cookies (guest session, auth token) are not sent automatically —
// they have to be forwarded to the API, otherwise the guest cart and favorites are lost.
const getServerCookieHeader = () => {
  if (typeof window !== 'undefined') return undefined;

  try {
    return getRequestHeader('cookie');
  } catch {
    return undefined;
  }
};

apiWithoutAuth.interceptors.request.use((config) => {
  const locale = isomorphicCookie.get(COOKIES.LOCALE);
  if (locale) config.headers['Accept-Language'] = locale;

  const cookie = getServerCookieHeader();
  if (cookie) config.headers.Cookie = cookie;

  // FEATURE DISABLED: Guest currency choice (prices show in UZS only).
  // const currency = isomorphicCookie.get(COOKIES.CURRENCY);
  // if (currency) {
  //   config.params = { ...config.params, currency };
  // }
  return config;
});

api.interceptors.request.use((config) => {
  const token = isomorphicCookie.get(COOKIES.ACCESS_TOKEN);
  const locale = isomorphicCookie.get(COOKIES.LOCALE);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (locale) config.headers['Accept-Language'] = locale;

  const cookie = getServerCookieHeader();
  if (cookie) config.headers.Cookie = cookie;

  return config;
});

api.interceptors.response.use(
  (config) => config,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && error.config && !originalRequest._isRetry) {
      originalRequest._isRetry = true;

      const accessToken = isomorphicCookie.get(COOKIES.ACCESS_TOKEN);
      const refreshToken = isomorphicCookie.get(COOKIES.REFRESH_TOKEN);

      if (refreshToken) {
        try {
          const res = await apiWithoutAuth
            .post<ApiResponse<TokenResponse>>('authentication/users/token-refresh/', {
              refresh_token: refreshToken
            })
            .then((res) => res.data);
          isomorphicCookie.set(
            COOKIES.ACCESS_TOKEN,
            res.result.access_token,
            CROSS_SITE_COOKIE_OPTIONS
          );
          isomorphicCookie.set(
            COOKIES.REFRESH_TOKEN,
            res.result.refresh_token,
            CROSS_SITE_COOKIE_OPTIONS
          );
          return api.request(originalRequest);
        } catch {
          // Token refresh failed — fall through to session cleanup.
        }
      }

      isomorphicCookie.delete(COOKIES.ACCESS_TOKEN);
      isomorphicCookie.delete(COOKIES.REFRESH_TOKEN);
      isomorphicCookie.delete(COOKIES.CURRENT_USER);

      // The session is gone — retry the request as a guest so public data still loads.
      if (originalRequest.headers) {
        const headers = originalRequest.headers as {
          delete?: (name: string) => void;
          Authorization?: string;
        };
        if (typeof headers.delete === 'function') headers.delete('Authorization');
        else delete headers.Authorization;

        originalRequest._isGuestRetry = true;
        return api.request(originalRequest);
      }

      if (
        accessToken &&
        typeof window !== 'undefined' &&
        location.pathname !== '/'
      ) {
        location.href = '/';
      }
    }
    throw error;
  }
);

export { api, apiWithoutAuth };
