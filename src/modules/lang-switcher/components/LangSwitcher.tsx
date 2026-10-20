import { useQueryClient } from '@tanstack/react-query';

import type { Locale } from '@/shared/i18n/config';

import { dynamicActivate, getLocale } from '@/shared/i18n';
import { localeFlagOptions, localeImageMap, localeLabelMap } from '@/shared/i18n/constants';
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
          <Button variant='outline'>
            <span className={`fi text-sm uppercase fi-${localeImageMap[currentLocale]}`} />
            <span>{localeLabelMap[currentLocale]}</span>
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
