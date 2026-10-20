import type { Locale } from '@/shared/i18n/config.ts';

export const localeLabelMap: Record<Locale, string> = {
  uz: "O'zbek",
  ru: 'Русский',
  en: 'English'
};

export const localeShortLabelMap: Record<Locale, string> = {
  uz: 'Uz',
  ru: 'Ру',
  en: 'En'
};

export const localeImageMap: Record<Locale, string> = {
  uz: 'uz',
  ru: 'ru',
  en: 'us'
};

export const localeOptions = Object.entries(localeLabelMap).map(([key, value]) => ({
  value: key as Locale,
  label: value
}));

export const localeFlagOptions = Object.entries(localeLabelMap).map(([key, value]) => ({
  value: key as Locale,
  label: value,
  flag: localeImageMap[key as Locale]
}));
