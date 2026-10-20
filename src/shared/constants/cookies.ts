export const COOKIES = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  LOCALE: 'locale',
  CURRENT_USER: 'current_user',
  CURRENCY: 'currency'
};

const LOCAL_HOSTS = ['localhost', '127.0.0.1', '::1'];

// The API is served from another host (api.snaber.uz), so the cookies have to be sent on
// cross-site requests — that requires SameSite=None together with Secure. Localhost is a
// secure context, so the same attributes work there as well.
const canUseCrossSiteCookies = () => {
  if (typeof window === 'undefined') return false;

  return (
    window.location.protocol === 'https:' || LOCAL_HOSTS.includes(window.location.hostname)
  );
};

export const CROSS_SITE_COOKIE_OPTIONS = {
  expires: 7,
  sameSite: (canUseCrossSiteCookies() ? 'none' : 'lax') as 'lax' | 'none',
  secure: canUseCrossSiteCookies()
};

export const LOCALE_COOKIE_OPTIONS = {
  ...CROSS_SITE_COOKIE_OPTIONS,
  expires: 365
};
