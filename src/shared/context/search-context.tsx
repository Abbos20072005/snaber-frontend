import React from 'react';

import type { SidebarData } from '@/shared/ui/page/types.ts';

import { CommandMenu } from '@/shared/ui/command-menu';

interface SearchContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchContext = React.createContext<SearchContextType | null>(null);

interface Props {
  children: React.ReactNode;
  sidebarData: SidebarData;
}

export const SearchProvider = ({ children, sidebarData }: Props) => {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <SearchContext value={{ open, setOpen }}>
      {children}
      <CommandMenu sidebarData={sidebarData} />
    </SearchContext>
  );
};

export const useSearch = () => {
  const searchContext = React.use(SearchContext);

  if (!searchContext) {
    throw new Error('useSearch has to be used within <SearchContext.Provider>');
  }

  return searchContext;
};
