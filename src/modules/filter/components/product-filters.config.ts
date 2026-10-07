import { parseAsArrayOf, parseAsInteger, parseAsString } from 'nuqs';

export const productFilterQueryConfig = {
  type: parseAsString.withDefault(''),
  product_type: parseAsString.withDefault(''),
  category: parseAsString.withDefault(''),
  price_min: parseAsInteger,
  price_max: parseAsInteger,
  values: parseAsArrayOf(parseAsInteger).withDefault([])
} as const;
