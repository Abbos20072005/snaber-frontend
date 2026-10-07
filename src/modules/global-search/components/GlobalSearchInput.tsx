import { useLingui } from '@lingui/react/macro';
import { SearchIcon } from 'lucide-react';

import { InputGroup, InputGroupAddon, InputGroupInput } from '@/shared/ui/input-group.tsx';

interface Props {
  search: string;
  handleSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  setIsFocused: (isFocused: boolean) => void;
  setSearch: (search: string) => void;
}

export const GlobalSearchInput = ({ search, setSearch, handleSubmit, setIsFocused }: Props) => {
  const { t } = useLingui();

  return (
    <form className='flex-1' onSubmit={handleSubmit}>
      <InputGroup className='w-full'>
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput
          aria-label='Search'
          type='search'
          value={search}
          autoComplete='off'
          onBlur={() => setIsFocused(false)}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={t`Search building materials`}
        />
      </InputGroup>
    </form>
  );
};
