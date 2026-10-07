import type { DateArg, Locale as DateFnsLocale } from 'date-fns';
import type { FormatOptions } from 'date-fns/format';

import { useLingui } from '@lingui/react/macro';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale/ru';
import { uz } from 'date-fns/locale/uz';

import type { Locale } from '@/shared/i18n';

import { COOKIES } from '@/shared/constants';
import { SOURCE_LOCALE } from '@/shared/i18n';
import { isomorphicCookie } from '@/shared/lib/isomorphic-cookie.ts';

export const formatPhoneNumber = (phoneNumber: string) =>
  phoneNumber.replace(/(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 ($2) $3 $4 $5');

export const formatPrice = (price: number | string) =>
  price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

export const formatCompactNumber = (
  value: number,
  locales: Intl.LocalesArgument = 'en',
  options: Intl.NumberFormatOptions = {}
) =>
  new Intl.NumberFormat(locales, {
    maximumFractionDigits: 1,
    notation: 'compact',
    ...options
  }).format(value);

const localeMap: Record<Locale, DateFnsLocale | undefined> = {
  en: undefined,
  ru,
  uz
};

export const formatLocaleDate = (
  date: DateArg<Date> & {},
  formatStr: string,
  options?: FormatOptions
) => {
  const locale = (isomorphicCookie.get(COOKIES.LOCALE) || SOURCE_LOCALE) as Locale;
  return format(date, formatStr, { locale: localeMap[locale], ...options });
};

export function formatDateToString(date: Date) {
  return format(date, 'yyyy-MM-dd');
}

export function formatDateTimeToString(date: Date) {
  return format(date, "yyyy-MM-dd'T'HH:mm:ss");
}

export function formatDate(
  date: number | string | Date | undefined,
  opts: Intl.DateTimeFormatOptions = {}
) {
  if (!date) return '';

  try {
    return new Intl.DateTimeFormat('en-US', {
      month: opts.month ?? 'long',
      day: opts.day ?? 'numeric',
      year: opts.year ?? 'numeric',
      ...opts
    }).format(new Date(date));
  } catch (_err) {
    console.error(_err);
    return '';
  }
}

export const formatFileSize = (size: number) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

export function useFormatCount() {
  const { t } = useLingui();

  return (num: number): string => {
    if (num >= 1_000_000_000)
      return `${(num / 1_000_000_000).toFixed(1).replace(/\.0$/, '')} ${t`mlrd`}`;
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, '')} ${t`mln`}`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1).replace(/\.0$/, '')} ${t`k`}`;
    return num.toString();
  };
}
