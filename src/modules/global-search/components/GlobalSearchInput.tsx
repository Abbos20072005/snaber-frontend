import { useLingui } from '@lingui/react/macro';
import { SearchIcon } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { InputGroup, InputGroupInput } from '@/shared/ui/input-group.tsx';

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
      <InputGroup className='h-13 w-full rounded-full bg-card py-1 pr-1 pl-3.5 shadow-xs'>
        <InputGroupInput
          aria-label='Search'
          className='h-full text-[17px]!'
          type='search'
          value={search}
          autoComplete='off'
          onBlur={() => setIsFocused(false)}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={t`Search building materials`}
        />
        <Button
          aria-label={t`Search`}
          className='size-11 shrink-0 rounded-full'
          size='icon-lg'
          type='submit'
        >
          <SearchIcon className='size-5.5' strokeWidth={2.4} />
        </Button>
      </InputGroup>
    </form>
  );
};
