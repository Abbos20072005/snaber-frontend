import { i18n } from '@lingui/core';

import { COOKIES } from '@/shared/constants';
import { getLocale } from '@/shared/i18n/getLocale.ts';
import { isomorphicCookie } from '@/shared/lib/isomorphic-cookie.ts';

import type { Locale } from './config';

import { APP_LOCALES, SOURCE_LOCALE } from './config';

export const dynamicActivate = async (locale: Locale = getLocale()) => {
  if (!APP_LOCALES.includes(locale)) {
    console.warn(`Invalid locale "${locale}", defaulting to "en"`);
    locale = SOURCE_LOCALE;
    isomorphicCookie.set(COOKIES.LOCALE, SOURCE_LOCALE, { expires: 365 });
  }
  const catalog = await import(`./locales/${locale}.po`);
  i18n.loadAndActivate({ locale, messages: catalog.messages });
  isomorphicCookie.set(COOKIES.LOCALE, locale, { expires: 365 });
};
