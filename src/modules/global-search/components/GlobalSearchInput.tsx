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
      <div className='bg-primary flex h-12 items-center gap-1.5 rounded-xl p-1'>
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
          className='bg-primary size-10 shrink-0 rounded-full text-white hover:bg-primary/90'
          size='icon-lg'
          type='submit'
        >
          <SearchIcon className='size-4.5' />
        </Button>
      </div>
    </form>
  );
};
