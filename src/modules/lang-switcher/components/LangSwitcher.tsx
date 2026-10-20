import { useQueryClient } from '@tanstack/react-query';
import { ChevronDownIcon, LanguagesIcon } from 'lucide-react';

import type { Locale } from '@/shared/i18n/config';

import { dynamicActivate, getLocale } from '@/shared/i18n';
import { localeFlagOptions, localeShortLabelMap } from '@/shared/i18n/constants';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/shared/ui/dropdown-menu';

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export const LangSwitcher = ({ className, ...props }: Props) => {
  const currentLocale = getLocale();
  const queryClient = useQueryClient();

  const onLocaleChange = async (locale: Locale) => {
    await dynamicActivate(locale);
    void queryClient.invalidateQueries();
  };

  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger
        render={
          <Button className={cn('gap-1 px-2 font-semibold', className)} variant='ghost'>
            <LanguagesIcon className='size-5' />
            <span>{localeShortLabelMap[currentLocale]}</span>
            <ChevronDownIcon className='size-4' />
          </Button>
        }
      />
      <DropdownMenuContent className='w-auto' sideOffset={10}>
        <DropdownMenuGroup>
          {localeFlagOptions.map(({ value, label, flag }) => (
            <DropdownMenuItem
              key={value}
              render={
                <span className='flex items-center gap-2'>
                  <span className={`fi fi-${flag}`} />
                  <span>{label}</span>
                </span>
              }
              onClick={() => onLocaleChange(value)}
            />
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
