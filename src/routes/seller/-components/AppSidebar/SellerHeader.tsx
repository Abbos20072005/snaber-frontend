import { useLingui } from '@lingui/react/macro';
import { useIsFetching, useIsMutating, useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { BellIcon, LogOutIcon, SettingsIcon, UserPenIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { useAuth } from '@/modules/auth';
import { AlertLogoutDialog } from '@/modules/auth/components';
import { LangSwitcher } from '@/modules/lang-switcher';
import { getUnreadNotificationCountQueryOptions, NotificationCard } from '@/modules/notifications';
import { cn } from '@/shared/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/shared/ui/dropdown-menu';
import { LoadingLine } from '@/shared/ui/loading-line';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';

export const SellerHeader = () => {
  const { t } = useLingui();
  const { user } = useAuth();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState<boolean>(false);

  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const isGlobalPending = isFetching > 0 || isMutating > 0;
  const [visible, setVisible] = React.useState(false);

  const unreadNotificationsQuery = useQuery({
    ...getUnreadNotificationCountQueryOptions(),
    enabled: Boolean(user)
  });

  const hasUnreadNotifications = Boolean(unreadNotificationsQuery.data?.data.unread_count);

  useEffect(() => {
    if (isGlobalPending) {
      const t = setTimeout(setVisible, 200, true); // delay
      return () => clearTimeout(t);
    } else setVisible(false);
  }, [isGlobalPending]);

  const AVATAR_IMAGE = user?.image;

  return (
    <div className='bg-background sticky top-0 z-10 flex items-center justify-end gap-2 border-b px-6 py-3'>
      <div className='flex items-center gap-4'>
        <LangSwitcher />
        <Popover>
          <PopoverTrigger
            render={
              <Button aria-label='Notifications' size='icon' type='button' variant='ghost'>
                <BellIcon />
                {hasUnreadNotifications && (
                  <span className='absolute flex size-2'>
                    <span className='absolute -top-1.5 -right-1 inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75'></span>
                    <span className='relative -top-1.5 -right-1 inline-flex size-2 rounded-full bg-red-700'></span>
                  </span>
                )}
              </Button>
            }
          />
          <PopoverContent align='center'>
            <NotificationCard />
          </PopoverContent>
        </Popover>
        <Link hash='settings' to='/seller/profile'>
          <Button aria-label='Settings' size='icon' type='button' variant='ghost'>
            <SettingsIcon />
          </Button>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Avatar>
                <AvatarImage src={AVATAR_IMAGE} />
                <AvatarFallback>
                  <span className='text-primary font-medium uppercase'>{user?.full_name[0]}</span>
                </AvatarFallback>
              </Avatar>
            }
          />
          <DropdownMenuContent align='end' className='w-2.5'>
            <DropdownMenuItem
              render={
                <Link to='/seller/profile'>
                  <UserPenIcon />
                  {t`Profile`}
                </Link>
              }
            />
            <DropdownMenuItem variant='destructive' onClick={() => setLogoutDialogOpen(true)}>
              <LogOutIcon />
              {t`Logout`}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <AlertLogoutDialog onOpenChange={setLogoutDialogOpen} open={logoutDialogOpen} />
      <LoadingLine
        className={cn(
          'absolute inset-x-0 top-full transition-all duration-300',
          visible ? 'visible opacity-100' : 'invisible -translate-y-0.5 opacity-0'
        )}
      />
    </div>
  );
};
