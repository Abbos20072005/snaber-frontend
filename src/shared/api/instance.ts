import axios from 'axios';

import { COOKIES } from '@/shared/constants';
import { isomorphicCookie } from '@/shared/lib/isomorphic-cookie.ts';

const api = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_API_URL
});

const apiWithoutAuth = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_API_URL
});

apiWithoutAuth.interceptors.request.use((config) => {
  const locale = isomorphicCookie.get(COOKIES.LOCALE);
  if (locale) config.headers['Accept-Language'] = locale;
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
          isomorphicCookie.set(COOKIES.ACCESS_TOKEN, res.result.access_token, { expires: 7 });
          isomorphicCookie.set(COOKIES.REFRESH_TOKEN, res.result.refresh_token, { expires: 7 });
          return api.request(originalRequest);
        } catch {
          // Token refresh failed — fall through to session cleanup.
        }
      }

      isomorphicCookie.delete(COOKIES.ACCESS_TOKEN);
      isomorphicCookie.delete(COOKIES.REFRESH_TOKEN);
      isomorphicCookie.delete(COOKIES.CURRENT_USER);
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
