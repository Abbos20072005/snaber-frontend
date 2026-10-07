// @ts-ignore
import type { CookieAttributes } from 'js-cookie';

import { createIsomorphicFn } from '@tanstack/react-start';
import { deleteCookie, getCookie, setCookie } from '@tanstack/react-start/server';
import { addDays, isDate } from 'date-fns';
import Cookies from 'js-cookie';

export const isomorphicCookie = {
  get: createIsomorphicFn()
    .client((key: string) => Cookies.get(key))
    .server((key: string) => getCookie(key)),

  set: createIsomorphicFn()
    .client((key: string, value: string, options?: CookieAttributes) =>
      Cookies.set(key, value, options)
    )
    .server((key: string, value: string, options?: CookieAttributes) =>
      setCookie(key, value, {
        ...options,
        expires: isDate(options?.expires) ? options?.expires : addDays(new Date(), options?.expires)
      })
    ),

  delete: createIsomorphicFn()
    .client((key: string) => Cookies.remove(key))
    .server((key: string) => deleteCookie(key))
};
