import type { ReactNode } from 'react';

import { useLingui } from '@lingui/react/macro';
import { useQuery } from '@tanstack/react-query';

import { getAllCategoriesQueryOptions } from '@/modules/category';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList
} from '@/shared/ui/combobox';

interface Props {
  children?: ReactNode;
  disabled?: boolean;
  type?: 'combobox' | 'select';
  value: Option | null;
  onValueChange?: (value: Option | null) => void;
}
interface Option {
  label: string;
  value: string;
}

export const CategoryCombobox = ({ value, onValueChange, disabled }: Props) => {
  const { t } = useLingui();

  const categoryQuery = useQuery(getAllCategoriesQueryOptions());
  const categories = categoryQuery.data?.data || [];

  return (
    <>
      <Combobox
        items={categories.map((category) => ({
          label: category.name,
          value: String(category.id)
        }))}
        disabled={disabled}
        value={value}
        itemToStringLabel={(item) => item.label}
        itemToStringValue={(item) => item.value}
        onValueChange={onValueChange}
      >
        <ComboboxInput placeholder={t`Search...`} showClear showTrigger />
        <ComboboxContent>
          <ComboboxEmpty>{t`No results.`}</ComboboxEmpty>
          <ComboboxList>
            {(item: Option) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </>
  );
};
