import { useLingui } from '@lingui/react/macro';
import { Link } from '@tanstack/react-router';
import { LayoutDashboardIcon, LogOutIcon, ShoppingBag, SquarePenIcon, User } from 'lucide-react';

import { useAuth } from '@/modules/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/shared/ui/dropdown-menu';

export const AccountDropDown = () => {
  const { t } = useLingui();
  const { user, onLogout } = useAuth();

  const AVATAR_IMAGE = user?.image;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={AVATAR_IMAGE} />
          <AvatarFallback>
            {user?.full_name ? (
              <span className='text-primary font-medium uppercase'>{user.full_name[0]}</span>
            ) : (
              <User className='text-primary size-4' />
            )}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end' className='w-50' sideOffset={10}>
        <DropdownMenuItem className={'flex-col items-start gap-0.5'}>
          <p className='text-foreground font-bold'>{user?.full_name ?? t`User`}</p>
          <p className='text-muted-foreground max-w-full truncate text-xs'>
            {user?.phone_number ?? user?.email}
          </p>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {user?.role === 'buyer' ? (
            <>
              <DropdownMenuItem
                render={
                  <Link to='/profile/dashboard'>
                    <User />
                    {t`My Account`}
                  </Link>
                }
                className='hidden md:flex'
              />
              <DropdownMenuItem
                render={
                  <Link to='/profile'>
                    <User />
                    {t`My Account`}
                  </Link>
                }
                className='md:hidden'
              />
              <DropdownMenuItem
                render={
                  <Link to='/profile/settings'>
                    <SquarePenIcon />
                    {t`Personal Information`}
                  </Link>
                }
              />
              <DropdownMenuItem
                render={
                  <Link to='/profile/orders'>
                    <ShoppingBag />
                    {t`My Orders`}
                  </Link>
                }
              />
            </>
          ) : (
            <>
              <DropdownMenuItem
                render={
                  <Link to='/admin'>
                    <LayoutDashboardIcon />
                    {t`Dashboard`}
                  </Link>
                }
              />
              <DropdownMenuItem
                render={
                  <Link to='/admin/profile'>
                    <User />
                    {t`My Account`}
                  </Link>
                }
              />
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem variant='destructive' onClick={onLogout}>
            <LogOutIcon />
            {t`Logout`}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
