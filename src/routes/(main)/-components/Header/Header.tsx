import type { ReactNode } from 'react';

import { useLingui } from '@lingui/react/macro';
import { Link } from '@tanstack/react-router';
import { HeartIcon, PackageIcon, ShoppingCartIcon } from 'lucide-react';

import { useAuth } from '@/modules/auth';
import { GlobalSearch } from '@/modules/global-search';
import { LangSwitcher } from '@/modules/lang-switcher';
import { SiteLogo } from '@/routes/(main)/-components/SiteLogo';
import { useAuthContext } from '@/shared/context';
import { useCartStore, useFavoritesStore } from '@/shared/store';
import { Button } from '@/shared/ui/button';

import { AccountDropDown } from './AccountDropDown';
import { HeaderTopBar } from './HeaderTopBar';

interface HeaderLinkProps {
  badge?: number;
  icon: ReactNode;
  label: string;
  to: string;
}

const HeaderLink = ({ badge, icon, label, to }: HeaderLinkProps) => (
  <Link
    className='text-muted-foreground hover:text-foreground hidden flex-col items-center gap-1 text-sm font-semibold whitespace-nowrap transition-colors md:flex'
    to={to}
  >
    <span className='relative'>
      {icon}
      {badge != null && badge > 0 && (
        <span className='bg-primary text-primary-foreground absolute -top-2 -right-2.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1 text-[11px] leading-none font-bold'>
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </span>
    <span className='leading-none'>{label}</span>
  </Link>
);

export const Header = () => {
  const { t } = useLingui();
  const { setIsOpen } = useAuthContext();
  const { user } = useAuth();

  const cartItemsLength = useCartStore((state) => state.cartItemsLength);
  const favoritesCount = useFavoritesStore((state) => state.favorites.length);

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const ordersPath =
    user?.role === 'seller' ? '/seller/orders' : isAdmin ? '/admin/orders' : '/profile/orders';

  return (
    <header className='sticky top-0 z-50 w-full border-b'>
      <HeaderTopBar />
      <div className='border-border/60 bg-background'>
        <div className='container flex h-16 items-center gap-x-6 gap-y-3'>
          <Link
            aria-label='snaber.uz'
            className='flex h-11 items-center justify-center rounded-lg px-1'
            to='/'
          >
            <SiteLogo />
          </Link>

          <div className='flex flex-1 items-center justify-center gap-1 sm:gap-2'>
            <GlobalSearch className='max-w-2xl' />
            <LangSwitcher />

            <div className='ml-1 flex items-center gap-5'>
              {!isAdmin && (
                <>
                  <HeaderLink
                    badge={favoritesCount}
                    label={t`Favorites`}
                    icon={<HeartIcon className='size-6' strokeWidth={2.2} />}
                    to='/favorites'
                  />
                  <HeaderLink
                    badge={cartItemsLength}
                    label={t`Cart`}
                    icon={<ShoppingCartIcon className='size-6' strokeWidth={2.2} />}
                    to='/cart'
                  />
                </>
              )}

              {user && (
                <HeaderLink
                  label={t`Orders`}
                  icon={<PackageIcon className='size-6' strokeWidth={2.2} />}
                  to={ordersPath}
                />
              )}

              {user ? (
                <AccountDropDown />
              ) : (
                <Button
                  className='ml-1 h-10 rounded-full px-6 font-bold'
                  size='lg'
                  variant='secondary'
                  onClick={() => setIsOpen(true)}
                >
                  {t`Sign in`}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
