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
      <div className='flex h-10 items-center gap-1 rounded-xl bg-yellow-400 p-0.5'>
        <Input
          aria-label='Search'
          className='bg-background h-full flex-1 rounded-lg border-0 px-3.5 text-sm shadow-none focus-visible:ring-2'
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
          className='size-9 shrink-0 rounded-full bg-yellow-400 text-black hover:bg-yellow-300'
          size='icon-lg'
          type='submit'
        >
          <SearchIcon className='size-4' />
        </Button>
      </div>
    </form>
  );
};
