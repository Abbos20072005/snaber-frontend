import { useLingui } from '@lingui/react/macro';
import { SearchIcon } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

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
      <div className='bg-yellow-400 flex h-11 items-center gap-1.5 rounded-xl p-1'>
        <Input
          aria-label='Search'
          type='search'
          value={search}
          autoComplete='off'
          className='bg-background h-full flex-1 rounded-lg border-0 px-3.5 text-sm shadow-none focus-visible:ring-2'
          onBlur={() => setIsFocused(false)}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={t`Search building materials`}
        />
        <Button
          aria-label={t`Search`}
          className='bg-yellow-400 size-9 shrink-0 rounded-full text-black hover:bg-yellow-300'
          size='icon-lg'
          type='submit'
        >
          <SearchIcon className='size-4' />
        </Button>
      </div>
    </form>
  );
};
