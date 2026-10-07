import { msg } from '@lingui/core/macro';

const date = new Date();
export const CURRENT_MONTH = date.getMonth() + 1;
export const CURRENT_YEAR = date.getFullYear();

const currentYear = date.getFullYear();
export const YEARS = Array.from({ length: 5 }, (_, i) => ({
  label: (currentYear - i).toString()
}));

export const MONTHS = [
  { month: msg`January`, id: 1 },
  { month: msg`February`, id: 2 },
  { month: msg`March`, id: 3 },
  { month: msg`April`, id: 4 },
  { month: msg`May`, id: 5 },
  { month: msg`June`, id: 6 },
  { month: msg`July`, id: 7 },
  { month: msg`August`, id: 8 },
  { month: msg`September`, id: 9 },
  { month: msg`October`, id: 10 },
  { month: msg`November`, id: 11 },
  { month: msg`December`, id: 12 }
];
