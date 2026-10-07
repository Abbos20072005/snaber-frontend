import type { Locale } from '@/shared/i18n/config';

import { COOKIES } from '@/shared/constants';
import { SOURCE_LOCALE } from '@/shared/i18n/config';
import { isomorphicCookie } from '@/shared/lib/isomorphic-cookie';

export const getLocale = () => (isomorphicCookie.get(COOKIES.LOCALE) || SOURCE_LOCALE) as Locale;
