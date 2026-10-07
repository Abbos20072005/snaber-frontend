import { useLingui } from '@lingui/react/macro';
import { SearchIcon } from 'lucide-react';

import { InputGroup, InputGroupAddon, InputGroupInput } from '@/shared/ui/input-group';
interface Props {
  search: string;
  setSearch: (value: string) => void;
}

export const CompanySearchGroup = ({ search, setSearch }: Props) => {
  const { t } = useLingui();
  return (
    <InputGroup className='max-w-full md:max-w-sm'>
      <InputGroupInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t`Search company`}
      />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
    </InputGroup>
  );
};
