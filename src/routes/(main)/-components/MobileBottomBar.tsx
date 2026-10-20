import type { FC, ReactNode } from 'react';

import { useLingui } from '@lingui/react/macro';
import { Link } from '@tanstack/react-router';
import { HeartIcon, HomeIcon, LayoutGridIcon, ShoppingCartIcon, UserIcon } from 'lucide-react';

import { useAuth } from '@/modules/auth';
import { useAuthContext } from '@/shared/context';
import { cn } from '@/shared/lib/utils';
import { useCartStore, useFavoritesStore } from '@/shared/store';

interface NavItemProps {
  badge?: number;
  icon: ReactNode;
  label: string;
  to: string;
}

const NavItem: FC<NavItemProps> = ({ icon, label, badge, to }) => {
  return (
    <Link
      className='text-muted-foreground flex flex-1 flex-col items-center justify-center gap-0.5 py-2'
      activeProps={{ className: 'text-primary' }}
      to={to}
    >
      <span className='relative'>
        {icon}
        {badge != null && badge > 0 && (
          <span className='bg-primary text-primary-foreground absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-0.5 text-[10px] leading-none font-medium'>
            {badge > 99 ? '99+' : badge}
          </span>
        )}
      </span>
      <span className='text-[10px] leading-none'>{label}</span>
    </Link>
  );
};

export const MobileBottomBar = () => {
  const { t } = useLingui();
  const { user } = useAuth();
  const { setIsOpen } = useAuthContext();
  const cartItemsLength = useCartStore((state) => state.cartItemsLength);
  const favoritesCount = useFavoritesStore((state) => state.favorites.length);

  const isAdmin = user?.role === 'admin';

  return (
    <nav className='bg-background fixed right-0 bottom-0 left-0 z-50 border-t md:hidden'>
      <div className='flex h-16 items-stretch'>
        <NavItem label={t`Home`} icon={<HomeIcon size={22} />} to='/' />
        <NavItem label={t`Catalog`} icon={<LayoutGridIcon size={22} />} to='/catalog' />
        {!isAdmin && (
          <>
            <NavItem
              badge={favoritesCount}
              label={t`Favorites`}
              icon={<HeartIcon size={22} />}
              to='/favorites'
            />
            <NavItem
              badge={cartItemsLength}
              label={t`Cart`}
              icon={<ShoppingCartIcon size={22} />}
              to='/cart'
            />{' '}
          </>
        )}
        {user ? (
          <NavItem
            label={t`Profile`}
            icon={<UserIcon size={22} />}
            to={user.role === 'admin' ? '/admin/dashboard' : '/profile'}
          />
        ) : (
          <button
            className={cn(
              'text-muted-foreground flex flex-1 flex-col items-center justify-center gap-0.5 py-2'
            )}
            type='button'
            onClick={() => setIsOpen(true)}
          >
            <UserIcon size={22} />
            <span className='text-[10px] leading-none'>{t`Login`}</span>
          </button>
        )}
      </div>
    </nav>
  );
};
