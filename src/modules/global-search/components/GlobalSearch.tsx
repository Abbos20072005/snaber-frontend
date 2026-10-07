import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeftIcon, SearchIcon } from 'lucide-react';
import { parseAsString, useQueryState } from 'nuqs';
import { useState } from 'react';

import type { InputGroup } from '@/shared/ui/input-group';

import { useDebouncedValue } from '@/shared/hooks/useDeboucedValue';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button.tsx';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger
} from '@/shared/ui/dialog.tsx';

import { getGlobalSearchQueryOptions } from '../options';
import { GlobalSearchInput } from './GlobalSearchInput.tsx';
import { GlobalSearchSuggestionList } from './GlobalSearchSuggestionList.tsx';

interface Props extends React.ComponentProps<typeof InputGroup> {}

export const GlobalSearch = ({ className, ...props }: Props) => {
  const navigate = useNavigate();
  const [defaultSearch] = useQueryState('search', parseAsString.withDefault(''));
  const [search, setSearch] = useState(defaultSearch);
  const [isFocused, setIsFocused] = useState(false);
  const debouncedSearch = useDebouncedValue(search, 300);
  const [openMobile, setOpenMobile] = useState(false);

  const isEnabled = debouncedSearch.trim().length > 0;

  const getGlobalSearchQuery = useQuery(
    getGlobalSearchQueryOptions(
      {
        params: { search: debouncedSearch }
      },
      isEnabled
    )
  );
  const globalSearch = getGlobalSearchQuery.data?.data;

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (search.trim().length === 0) return;

    setIsFocused(false);
    await navigate({ to: '/products', search: { search } });
    setOpenMobile(false);
  };

  return (
    <div className={cn('flex flex-1 justify-end', className)} {...props}>
      <div className='relative hidden max-w-100 flex-1 lg:block'>
        <GlobalSearchInput
          handleSubmit={handleSubmit}
          search={search}
          setSearch={setSearch}
          setIsFocused={setIsFocused}
        />
        <div
          className={cn(
            'bg-background absolute top-[calc(100%+0.5rem)] z-50 h-auto max-h-[calc(60svh)] w-full max-w-120 overflow-y-auto rounded-lg border px-2 py-4 shadow-md transition-all',
            isFocused && search && globalSearch ? 'visible opacity-100' : 'invisible opacity-0'
          )}
        >
          <GlobalSearchSuggestionList result={globalSearch} />
        </div>
      </div>
      <Dialog onOpenChange={setOpenMobile} open={openMobile}>
        <DialogTrigger
          render={
            <Button className='lg:hidden' size='icon' variant='ghost'>
              <SearchIcon />
            </Button>
          }
        />
        <DialogContent className='h-dvh max-w-full! rounded-none p-0' showCloseButton={false}>
          <DialogHeader className='flex flex-row gap-2 border-b p-2'>
            <DialogClose
              render={
                <Button variant='ghost'>
                  <ArrowLeftIcon />
                </Button>
              }
            ></DialogClose>
            <GlobalSearchInput
              handleSubmit={handleSubmit}
              search={search}
              setSearch={setSearch}
              setIsFocused={setIsFocused}
            />
          </DialogHeader>
          <GlobalSearchSuggestionList
            result={globalSearch}
            onCloseDialog={() => setOpenMobile(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
