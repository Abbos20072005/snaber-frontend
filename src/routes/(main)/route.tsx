import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { useQueryState } from 'nuqs';
import { useEffect } from 'react';

import { getAuthMeQueryOptions } from '@/modules/auth';
import { OAuthRegister } from '@/modules/oauth';
import { getCartListQueryOptions, getFavoritesQueryOptions } from '@/modules/products';
import { Footer, Header, MobileBottomBar } from '@/routes/(main)/-components';
import { COOKIES } from '@/shared/constants';
import { AuthProvider } from '@/shared/context';
import { isomorphicCookie } from '@/shared/lib/isomorphic-cookie';
import { CartProvider, FavoritesProvider, useCartStore, useFavoritesStore } from '@/shared/store';
import { Spinner } from '@/shared/ui/spinner.tsx';

const SiteLayout = () => {
  const [oAuthCode] = useQueryState('code');

  return (
    <div className='flex min-h-dvh flex-col'>
      <Header />
      <main className='flex-1 pb-16 md:pb-0'>
        <Outlet />
      </main>
      <Footer />
      <MobileBottomBar />
      {oAuthCode && <OAuthRegister oAuthCode={oAuthCode} />}
    </div>
  );
};

// Keeps the client stores in sync with the server state (login, add to cart, favorites).
const StoreSync = ({ cart, favorites }: { cart: Cart[]; favorites: ProductPreview[] }) => {
  const { syncCart } = useCartStore();
  const { setFavorites } = useFavoritesStore();

  useEffect(() => {
    syncCart(cart);
  }, [cart, syncCart]);

  useEffect(() => {
    setFavorites(favorites);
  }, [favorites, setFavorites]);

  return null;
};

const StoreData = ({ children }: { children: React.ReactNode }) => {
  const favoritesQuery = useSuspenseQuery(getFavoritesQueryOptions());
  const cartQuery = useSuspenseQuery(getCartListQueryOptions());

  const favorites = (favoritesQuery.data ?? []).map((item) => item.product);
  const cart = cartQuery.data?.groups ?? [];

  return (
    <FavoritesProvider initialFavorites={favorites}>
      <CartProvider initialCart={cart}>
        <StoreSync cart={cart} favorites={favorites} />
        {children}
      </CartProvider>
    </FavoritesProvider>
  );
};

const RouteComponent = () => {
  return (
    <AuthProvider>
      <StoreData>
        <SiteLayout />
      </StoreData>
    </AuthProvider>
  );
};

export const Route = createFileRoute('/(main)')({
  component: RouteComponent,
  pendingComponent: () => (
    <div className='grid h-svh place-items-center'>
      <Spinner className='size-6' />
    </div>
  ),
  beforeLoad: async ({ context: { queryClient } }) => {
    let user: User | null = null;

    if (isomorphicCookie.get(COOKIES.ACCESS_TOKEN)) {
      user = await queryClient.ensureQueryData(getAuthMeQueryOptions()).catch(() => null);
    }

    await Promise.all([
      queryClient.ensureQueryData(getFavoritesQueryOptions()).catch(() => []),
      queryClient
        .ensureQueryData(getCartListQueryOptions())
        .catch(() => ({ companies: 0, groups: [], products: 0, total_amount: '0' }))
    ]);

    return { user, favorites: [], cart: [] };
  }
});
