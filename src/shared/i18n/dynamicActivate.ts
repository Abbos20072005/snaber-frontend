import { i18n } from '@lingui/core';

import { COOKIES, LOCALE_COOKIE_OPTIONS } from '@/shared/constants';
import { getLocale } from '@/shared/i18n/getLocale.ts';
import { isomorphicCookie } from '@/shared/lib/isomorphic-cookie.ts';

import type { Locale } from './config';

import { APP_LOCALES, SOURCE_LOCALE } from './config';

export const dynamicActivate = async (locale: Locale = getLocale()) => {
  if (!APP_LOCALES.includes(locale)) {
    console.warn(`Invalid locale "${locale}", defaulting to "en"`);
    locale = SOURCE_LOCALE;
    isomorphicCookie.set(COOKIES.LOCALE, SOURCE_LOCALE, LOCALE_COOKIE_OPTIONS);
  }
  const catalog = await import(`./locales/${locale}.po`);
  i18n.loadAndActivate({ locale, messages: catalog.messages });
  isomorphicCookie.set(COOKIES.LOCALE, locale, LOCALE_COOKIE_OPTIONS);
};
