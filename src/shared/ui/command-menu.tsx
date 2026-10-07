import { useLingui } from '@lingui/react/macro';
import { useNavigate } from '@tanstack/react-router';
import { ArrowRightIcon, MoonIcon, SunIcon } from 'lucide-react';
import React from 'react';

import type { SidebarData } from '@/shared/ui/page/types';

import { usePermission } from '@/modules/auth';
import { useSearch } from '@/shared/context/search-context';
import { useTheme } from '@/shared/context/theme-context';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/shared/ui/command';

import { ScrollArea } from './scroll-area';

interface Props {
  sidebarData: SidebarData;
}

export const CommandMenu = ({ sidebarData }: Props) => {
  const { t } = useLingui();
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  const { open, setOpen } = useSearch();

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false);
      command();
    },
    [setOpen]
  );

  const { hasRole } = usePermission();

  return (
    <CommandDialog modal onOpenChange={setOpen} open={open}>
      <CommandInput placeholder={t`Type a command or search...`} />
      <CommandList>
        <ScrollArea className='h-72 pr-1'>
          <CommandEmpty>{t`No results found.`}</CommandEmpty>
          {sidebarData.navGroups.map((group, index) => {
            const filteredItems = group.items.filter(
              (item) => !item.allowedRoles || hasRole(item.allowedRoles)
            );

            if ((group.allowedRoles && !hasRole(group.allowedRoles)) || !filteredItems.length)
              return null;

            return (
              <CommandGroup key={index} heading={group.title && t(group.title)}>
                {filteredItems.map((navItem, i) => {
                  if (navItem.url)
                    return (
                      <CommandItem
                        key={`${navItem.url}-${i}`}
                        value={t(navItem.title)}
                        onSelect={() => {
                          runCommand(() => navigate({ to: navItem.url }));
                        }}
                      >
                        <div className='mr-2 flex h-4 w-4 items-center justify-center'>
                          <ArrowRightIcon className='text-muted-foreground/80 size-2' />
                        </div>
                        {t(navItem.title)}
                      </CommandItem>
                    );

                  return navItem.items?.map((subItem, i) => (
                    <CommandItem
                      key={`${subItem.url}-${i}`}
                      value={t(subItem.title)}
                      onSelect={() => {
                        runCommand(() => navigate({ to: subItem.url }));
                      }}
                    >
                      <div className='mr-2 flex h-4 w-4 items-center justify-center'>
                        <ArrowRightIcon className='text-muted-foreground/80 size-2' />
                      </div>
                      {t(subItem.title)}
                    </CommandItem>
                  ));
                })}
              </CommandGroup>
            );
          })}
          <CommandSeparator />
          <CommandGroup heading={t`Theme`}>
            <CommandItem onSelect={() => runCommand(() => setTheme('light'))}>
              <SunIcon /> <span>{t`Light`}</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('dark'))}>
              <MoonIcon className='scale-90' />
              <span>{t`Dark`}</span>
            </CommandItem>
          </CommandGroup>
        </ScrollArea>
      </CommandList>
    </CommandDialog>
  );
};
