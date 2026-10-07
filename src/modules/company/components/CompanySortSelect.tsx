import { useLingui } from '@lingui/react/macro';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/select';

import { companySortLabelMap, companySortLabelOptions } from '../constants';

interface Props {
  sort: SortType | null;
  setSort: (val: SortType | null) => void;
}

export const CompanySortSelect = ({ sort, setSort }: Props) => {
  const { t } = useLingui();

  return (
    <Select value={sort} onValueChange={(value) => setSort(value)}>
      <SelectTrigger className='w-full'>
        <SelectValue placeholder={t`Sorting`}>
          {sort ? `${t`Sort`}: ${t(companySortLabelMap[sort as SortType])}` : t`Sorting`}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {companySortLabelOptions.map(({ value, label }) => (
            <SelectItem key={value} className='w-full' value={value}>
              {t(label)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
