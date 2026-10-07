import type { MessageDescriptor } from '@lingui/core';

import { msg } from '@lingui/core/macro';

export const currencyCodes = [
  'USD',
  'EUR',
  'RUB',
  'CNY',
  'UZS'
] as const satisfies readonly CurrencyCode[];

export const currencySymbolMap: Record<CurrencyCode, string> = {
  CNY: '\u00A5',
  EUR: '\u20AC',
  RUB: '\u20BD',
  USD: '$',
  UZS: "so'm"
};

export const currencyFlagMap: Record<CurrencyCode, string> = {
  CNY: 'cn',
  EUR: 'eu',
  RUB: 'ru',
  USD: 'us',
  UZS: 'uz'
};

export const currencyLabelMap: Record<CurrencyCode, MessageDescriptor> = {
  CNY: msg`Chinese yuan`,
  EUR: msg`Euro`,
  RUB: msg`Russian ruble`,
  USD: msg`US dollar`,
  UZS: msg`Uzbek som`
};

export const currencyShortLabelMap: Record<CurrencyCode, MessageDescriptor> = {
  CNY: msg`Yuan`,
  EUR: msg`Euro`,
  RUB: msg`Ruble`,
  USD: msg`Dollar`,
  UZS: msg`Som`
};

export const currencyCountryLabelMap: Record<CurrencyCode, MessageDescriptor> = {
  CNY: msg`China`,
  EUR: msg`European Union`,
  RUB: msg`Russia`,
  USD: msg`United States`,
  UZS: msg`Uzbekistan`
};

export const currencyOptions = currencyCodes.map((value) => ({
  value,
  label: currencyLabelMap[value],
  shortLabel: currencyShortLabelMap[value],
  countryLabel: currencyCountryLabelMap[value],
  flag: currencyFlagMap[value],
  symbol: currencySymbolMap[value]
}));

export const defaultCurrencyCode: CurrencyCode = 'USD';
