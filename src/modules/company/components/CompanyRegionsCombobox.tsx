import { useLingui } from '@lingui/react/macro';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { useDebouncedValue } from '@/shared/hooks/useDeboucedValue';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList
} from '@/shared/ui/combobox';
import { Spinner } from '@/shared/ui/spinner';

import { getAllCompanyRegionsInfiniteOptions } from '../options';

export interface Option {
  label: string;
  value: string;
}

interface Props {
  value: Option | null;
  onValueChange: (value: Option | null) => void;
}

export const CompanyRegionsCombobox = ({ value, onValueChange }: Props) => {
  const [search, setSearch] = useState('');
  const useDeboucedSearchVal = useDebouncedValue(search, 300);
  const { t } = useLingui();

  const companyRegionsQuery = useInfiniteQuery(
    getAllCompanyRegionsInfiniteOptions({
      params: { page_size: 10, search: useDeboucedSearchVal }
    })
  );

  const industries = companyRegionsQuery.data?.pages.flatMap((item) => item.data.results) || [];

  const { ref } = useInView({
    threshold: 0,
    onChange: async (inView) => {
      if (inView) await companyRegionsQuery.fetchNextPage();
    }
  });

  const selectedRegion = industries.find((i) => String(i.id) === value?.value);

  const resolvedValue = selectedRegion
    ? { label: selectedRegion.name, value: String(selectedRegion.id) }
    : value;
  return (
    <>
      <Combobox
        items={industries.map((indusrty) => ({
          label: indusrty.name,
          value: String(indusrty.id)
        }))}
        value={resolvedValue}
        onValueChange={(val) => {
          onValueChange(val);
          setSearch(val?.label ?? '');
        }}
      >
        <ComboboxInput className='text-xs!' placeholder={t`Select a region`} />
        <ComboboxContent>
          <ComboboxEmpty>{t`No results.`}</ComboboxEmpty>
          <ComboboxList>
            {(item: Option) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
          <div ref={ref} />
          {companyRegionsQuery.hasNextPage && companyRegionsQuery.isFetchingNextPage && (
            <div className={'flex items-center justify-center'}>
              <Spinner />
            </div>
          )}
        </ComboboxContent>
      </Combobox>
    </>
  );
};
