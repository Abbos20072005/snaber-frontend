export const COOKIES = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  LOCALE: 'locale',
  CURRENT_USER: 'current_user',
  CURRENCY: 'currency'
};

const isSecureContext = () =>
  typeof window !== 'undefined' && window.location.protocol === 'https:';

// The API is served from another host (api.snaber.uz), so the cookies have to be sent
// on cross-site requests — that requires SameSite=None + Secure. Over plain http (local
// development) the browser rejects such cookies, so the default same-site mode is used.
export const CROSS_SITE_COOKIE_OPTIONS = {
  expires: 7,
  sameSite: (isSecureContext() ? 'none' : 'lax') as 'lax' | 'none',
  secure: isSecureContext()
};

export const LOCALE_COOKIE_OPTIONS = {
  ...CROSS_SITE_COOKIE_OPTIONS,
  expires: 365
};
