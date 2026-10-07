import { useLingui } from '@lingui/react/macro';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import React, { useState } from 'react';

import { useAuth } from '@/modules/auth';
import { currencyFlagMap, currencyOptions, currencyShortLabelMap } from '@/modules/currency';
import { patchAuthMe } from '@/shared/api';
import { COOKIES } from '@/shared/constants';
import { isomorphicCookie } from '@/shared/lib/isomorphic-cookie.ts';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/shared/ui/dropdown-menu';

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export const CurrencySwitcher = ({ className, ...props }: Props) => {
  const { t } = useLingui();
  const { user } = useAuth();
  const [currency, setCurrency] = useState<CurrencyCode>(
    user?.currency || (isomorphicCookie.get(COOKIES.CURRENCY) as CurrencyCode) || 'UZS'
  );

  const queryClient = useQueryClient();
  const router = useRouter();

  const patchUserMutation = useMutation({
    mutationFn: patchAuthMe
  });

  const onCurrencyChange = async (currency: CurrencyCode) => {
    // FEATURE DISABLED: Currency change required login.
    // if (!user) return;
    setCurrency(currency);
    // Guest choice is stored locally and sent with public API requests.
    isomorphicCookie.set(COOKIES.CURRENCY, currency, { expires: 365 });
    if (user) {
      void patchUserMutation.mutate({
        data: { currency }
      });
    }
    void queryClient.clear();
    router.clearCache();
    await router.invalidate();
  };

  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger
        render={
          <Button variant='outline'>
            <span className='flex items-center gap-1 text-sm'>
              <span className={`fi fi-${currencyFlagMap[currency]}`} />
              <span>{t(currencyShortLabelMap[currency])}</span>
            </span>
          </Button>
        }
      />
      <DropdownMenuContent className='w-auto' sideOffset={10}>
        <DropdownMenuGroup>
          {currencyOptions.map(({ value, label, flag }) => (
            <DropdownMenuItem
              key={value}
              render={
                <span className='flex items-center gap-2'>
                  <span className={`fi fi-${flag}`} />
                  <span>{t(label)}</span>
                </span>
              }
              onClick={() => onCurrencyChange(value)}
            />
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
