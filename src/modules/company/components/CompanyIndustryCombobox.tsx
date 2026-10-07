import { useLingui } from '@lingui/react/macro';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { useDebouncedValue } from '@/shared/hooks/useDeboucedValue';
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor
} from '@/shared/ui/combobox';
import { Spinner } from '@/shared/ui/spinner';

import { getAllCompanyIndustryInfiniteOptions } from '../options';

export interface Option {
  label: string;
  value: string;
}

interface Props {
  value: Option[];
  onValueChange: (value: Option[]) => void;
}

export const CompanyIndustryCombobox = ({ value, onValueChange }: Props) => {
  const [search, setSearch] = useState('');
  const useDebouncedSearchVal = useDebouncedValue(search, 300);
  const { t } = useLingui();
  const anchor = useComboboxAnchor();

  const companyIndustryQuery = useInfiniteQuery(
    getAllCompanyIndustryInfiniteOptions({
      params: { page_size: 10, search: useDebouncedSearchVal }
    })
  );

  const industries = companyIndustryQuery.data?.pages.flatMap((item) => item.data.results) || [];

  const { ref } = useInView({
    threshold: 0,
    onChange: async (inView) => {
      if (inView) await companyIndustryQuery.fetchNextPage();
    }
  });

  const resolvedValue = value.map((option) => {
    const industry = industries.find((item) => String(item.id) === option.value);

    return industry ? { label: industry.name, value: String(industry.id) } : option;
  });

  return (
    <Combobox
      multiple
      items={industries.map((industry) => ({
        label: industry.name,
        value: String(industry.id)
      }))}
      value={resolvedValue}
      isItemEqualToValue={(item, selectedItem) => item.value === selectedItem.value}
      onInputValueChange={setSearch}
      onValueChange={onValueChange}
    >
      <ComboboxChips ref={anchor}>
        {resolvedValue.map((option) => (
          <ComboboxChip key={option.value}>{option.label}</ComboboxChip>
        ))}
        <ComboboxChipsInput placeholder={t`Select industries`} />
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>{t`No results.`}</ComboboxEmpty>
        <ComboboxList>
          {(item: Option) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
        <div ref={ref} />
        {companyIndustryQuery.hasNextPage && companyIndustryQuery.isFetchingNextPage && (
          <div className='flex items-center justify-center'>
            <Spinner />
          </div>
        )}
      </ComboboxContent>
    </Combobox>
  );
};
