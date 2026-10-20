import { useLingui } from '@lingui/react/macro';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { LogOutIcon, SlidersHorizontalIcon, UserPenIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useAuth } from '@/modules/auth';
import { AlertLogoutDialog } from '@/modules/auth/components';
import { LangSwitcher } from '@/modules/lang-switcher';
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

export const AdminHeader = () => {
  const { user } = useAuth();
  const { t } = useLingui();

  const AVATAR_IMAGE = user?.image;

  const [logoutDialogOpen, setLogoutDialogOpen] = useState<boolean>(false);

  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const isGlobalPending = isFetching > 0 || isMutating > 0;
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    if (isGlobalPending) {
      const t = setTimeout(setVisible, 200, true);
      return () => clearTimeout(t);
    } else setVisible(false);
  }, [isGlobalPending]);

  return (
    <div className='bg-background sticky top-0 z-10 flex items-center justify-end gap-2 border-b px-6 py-3'>
      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-4 border-r py-1 pr-4'>
          <LangSwitcher />
          <Link hash='settings' to='/admin/profile'>
            <Button aria-label='Settings' className='cursor-pointer p-2' variant='ghost'>
              <SlidersHorizontalIcon />
            </Button>
          </Link>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className='flex cursor-pointer items-center gap-4 ps-3'>
            <div className='flex flex-col items-end text-end'>
              <h2 className='text-primary text-sm'>{user?.full_name}</h2>
              <p className='text-sidebar-primary text-xs font-medium'>{user?.email}</p>
            </div>
            <Avatar>
              <AvatarImage src={AVATAR_IMAGE} />
              <AvatarFallback>
                <span className='text-primary font-medium uppercase'>{user?.full_name[0]}</span>
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-2.5'>
            <DropdownMenuItem
              render={
                <Link to='/admin/profile'>
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
