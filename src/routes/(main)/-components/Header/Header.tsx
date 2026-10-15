import type { MessageDescriptor } from '@lingui/core';
import type { LinkProps } from '@tanstack/react-router';

import { msg } from '@lingui/core/macro';
import { Link } from '@tanstack/react-router';
import { PhoneIcon } from 'lucide-react';
// FEATURE DISABLED: Cart/favorites/notifications icons.
// import { BellIcon, HeartIcon, ShoppingCartIcon } from 'lucide-react';

// FEATURE DISABLED: Auth/notifications logic.
// import { useAuth } from '@/modules/auth';
// FEATURE DISABLED: Currency switcher (prices show in UZS only).
// import { CurrencySwitcher } from '@/modules/currency';
import { GlobalSearch } from '@/modules/global-search';
import { LangSwitcher } from '@/modules/lang-switcher';
import { SiteLogo } from '@/routes/(main)/-components/SiteLogo';
// FEATURE DISABLED: Notifications data.
// import { getUnreadNotificationCountQueryOptions, NotificationCard } from '@/modules/notifications';
// FEATURE DISABLED: Auth context (sign-in dialog).
// import { useAuthContext } from '@/shared/context';
// import { cn } from '@/shared/lib/utils';
// import { useCartStore, useFavoritesStore } from '@/shared/store';
// import { Button, buttonVariants } from '@/shared/ui/button';
// import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';

// FEATURE DISABLED: Old B2B logo image (rebranded to snaber.uz text logo).
// import HB2bImage from '../../../../../public/images/HB2bImage.png';
// FEATURE DISABLED: Account dropdown (profile/orders/logout).
// import { AccountDropDown } from './AccountDropDown';

export const links: { label: MessageDescriptor; to: LinkProps['to'] }[] = [
  { label: msg`Catalog`, to: '/catalog' }
  // FEATURE DISABLED: Companies list page.
  // { label: msg`Companies`, to: '/companies' },
  // FEATURE DISABLED: About page.
  // { label: msg`About`, to: '/about' }
];

export const Header = () => {
  // FEATURE DISABLED: Auth/notifications logic.
  // const { setIsOpen } = useAuthContext();
  // const { user } = useAuth();
  // const unreadNotificationsQuery = useQuery({
  //   ...getUnreadNotificationCountQueryOptions(),
  //   enabled: Boolean(user)
  // });

  // const hasUnreadNotifications = Boolean(unreadNotificationsQuery.data?.data.unread_count);
  // const cartItemsLength = useCartStore((state) => state.cartItemsLength);
  // const favoritesCount = useFavoritesStore((state) => state.favorites.length);

  return (
    <header className='sticky top-0 z-50 w-full border-b'>
      <div className='border-border/60 bg-background'>
        <div className='container flex h-16 items-center gap-x-6 gap-y-3'>
          <Link
            aria-label='snaber.uz'
            className='flex h-11 items-center justify-center rounded-lg px-1'
            to='/'
          >
            {/* FEATURE DISABLED: Old B2b logo image. */}
            {/* <img alt={t`Logo`} className='size-full rounded-md object-contain' src={HB2bImage} /> */}
            {/* FEATURE DISABLED: Old snaber.uz text logo (replaced by SiteLogo). */}
            {/* <span className='text-primary text-2xl font-extrabold tracking-tight'> */}
            {/*   snaber<span className='text-foreground'>.uz</span> */}
            {/* </span> */}
            <SiteLogo />
          </Link>

          {/* FEATURE DISABLED: Main nav (Catalog link removed from header). */}
          {/* <nav className='hidden items-center gap-8 md:flex'> */}
          {/*   {links.map((item) => ( */}
          {/*     <Link */}
          {/*       key={item.to} */}
          {/*       className='group' */}
          {/*       activeProps={{ className: 'active' }} */}
          {/*       inactiveProps={{ className: 'text-muted-foreground' }} */}
          {/*       to={item.to} */}
          {/*     > */}
          {/*       {t(item.label)} */}
          {/*       <div className='h-0.5 w-0 bg-yellow-400 transition-all group-hover:w-full group-[.active]:w-full' /> */}
          {/*     </Link> */}
          {/*   ))} */}
          {/* </nav> */}

          <div className='flex flex-1 items-center justify-center gap-1 sm:gap-2'>
            <GlobalSearch className='max-w-2xl' />
            {/* FEATURE DISABLED: Currency switcher (prices show in UZS only). */}
            {/* <CurrencySwitcher /> */}
            {/* FEATURE DISABLED: Currency switcher (auth-gated). */}
            {/* {!!user && <CurrencySwitcher />} */}
            <LangSwitcher />
            <a
              className='hidden items-center gap-1.5 text-sm font-semibold whitespace-nowrap hover:underline md:flex'
              href='tel:+998712037772'
            >
              <PhoneIcon className='size-4' />
              +998 71 203 77 72
            </a>
            {/* FEATURE DISABLED: Favorites shortcut. */}
            {/* {user?.role !== 'admin' && ( */}
            {/*   <> */}
            {/*     <Link */}
            {/*       className={cn(buttonVariants({ variant: 'ghost' }), 'hidden md:inline-flex')} */}
            {/*       to='/favorites' */}
            {/*     > */}
            {/*       <span className='relative'> */}
            {/*         <HeartIcon /> */}
            {/*         {favoritesCount > 0 && ( */}
            {/*           <span className='bg-primary text-primary-foreground absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full px-0.5 text-[10px] leading-none font-medium'> */}
            {/*             {favoritesCount > 99 ? '99+' : favoritesCount} */}
            {/*           </span> */}
            {/*         )} */}
            {/*       </span> */}
            {/*     </Link> */}
            {/*     <Link */}
            {/*       className={cn(buttonVariants({ variant: 'ghost' }), 'hidden md:inline-flex')} */}
            {/*       to='/cart' */}
            {/*     > */}
            {/*       <span className='relative'> */}
            {/*         <ShoppingCartIcon /> */}
            {/*         {cartItemsLength > 0 && ( */}
            {/*           <span className='bg-primary text-primary-foreground absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full px-0.5 text-[10px] leading-none font-medium'> */}
            {/*             {cartItemsLength > 99 ? '99+' : cartItemsLength} */}
            {/*           </span> */}
            {/*         )} */}
            {/*       </span> */}
            {/*     </Link> */}
            {/*     {user && ( */}
            {/*       <Popover> */}
            {/*         <PopoverTrigger */}
            {/*           render={ */}
            {/*             <Button */}
            {/*               aria-label={t`Notifications`} */}
            {/*               className='relative' */}
            {/*               size='icon' */}
            {/*               type='button' */}
            {/*               variant='ghost' */}
            {/*             > */}
            {/*               <BellIcon /> */}
            {/*               {hasUnreadNotifications && ( */}
            {/*                 <span className='absolute flex size-2'> */}
            {/*                   <span className='absolute -top-1.5 -right-1 inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75'></span> */}
            {/*                   <span className='relative -top-1.5 -right-1 inline-flex size-2 rounded-full bg-red-700'></span> */}
            {/*                 </span> */}
            {/*               )} */}
            {/*             </Button> */}
            {/*           } */}
            {/*         /> */}
            {/*         <PopoverContent align='end' className='w-90!'> */}
            {/*           <NotificationCard /> */}
            {/*         </PopoverContent> */}
            {/*       </Popover> */}
            {/*     )} */}
            {/*   </> */}
            {/* )} */}
            {/* FEATURE DISABLED: Auth entry (sign-in / account). */}
            {/* {user ? ( */}
            {/*   <AccountDropDown /> */}
            {/* ) : ( */}
            {/*   <Button onClick={() => setIsOpen(true)}>{t`Sign in`}</Button> */}
            {/* )} */}
          </div>
        </div>
      </div>
    </header>
  );
};
