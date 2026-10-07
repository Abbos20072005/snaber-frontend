import { createFileRoute, Outlet } from '@tanstack/react-router';
// FEATURE DISABLED: Auth/cart/favorites prefetch.
// import { useSuspenseQuery } from '@tanstack/react-query';
// import { useQueryState } from 'nuqs';

// import { getAuthMeQueryOptions } from '@/modules/auth';
// import { OAuthRegister } from '@/modules/oauth';
// import { getCartListQueryOptions, getFavoritesQueryOptions } from '@/modules/products';
import { Footer, Header, MobileBottomBar } from '@/routes/(main)/-components';
import { AuthProvider } from '@/shared/context';
import { CartProvider, FavoritesProvider } from '@/shared/store';
import { Spinner } from '@/shared/ui/spinner.tsx';

const SiteLayout = () => {
  // FEATURE DISABLED: OAuth callback handling.
  // const [oAuthCode] = useQueryState('code');

  return (
    <div className='flex min-h-dvh flex-col'>
      <Header />
      <main className='flex-1 pb-16 md:pb-0'>
        <Outlet />
      </main>
      <Footer />
      <MobileBottomBar />
      {/* FEATURE DISABLED: OAuth callback handling. */}
      {/* {oAuthCode && <OAuthRegister oAuthCode={oAuthCode} />} */}
    </div>
  );
};

// FEATURE DISABLED: Authed cart + favorites hydration (catalog-only mode uses empty stores).
// const AuthedData = ({ children }: { children: ReactNode }) => {
//   const favoritesQuery = useSuspenseQuery(getFavoritesQueryOptions());
//   const cartQuery = useSuspenseQuery(getCartListQueryOptions());

//   return (
//     <FavoritesProvider initialFavorites={(favoritesQuery.data ?? []).map((item) => item.product)}>
//       <CartProvider initialCart={cartQuery.data.groups ?? []}>{children}</CartProvider>
//     </FavoritesProvider>
//   );
// };

const GuestData = ({ children }: { children: React.ReactNode }) => (
  <FavoritesProvider initialFavorites={[]}>
    <CartProvider initialCart={[]}>{children}</CartProvider>
  </FavoritesProvider>
);

const RouteComponent = () => {
  // FEATURE DISABLED: Auth-gated stores (catalog-only mode always uses empty guest stores).
  // const hasToken = Boolean(isomorphicCookie.get(COOKIES.ACCESS_TOKEN));

  // return (
  //   <AuthProvider>
  //     {hasToken ? (
  //       <AuthedData>
  //         <SiteLayout />
  //       </AuthedData>
  //     ) : (
  //       <GuestData>
  //         <SiteLayout />
  //       </GuestData>
  //     )}
  //   </AuthProvider>
  // );

  return (
    <AuthProvider>
      <GuestData>
        <SiteLayout />
      </GuestData>
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
  beforeLoad: () => {
    // FEATURE DISABLED: Auth/cart/favorites prefetch (catalog-only mode).
    // let user: User | null = null;

    // if (isomorphicCookie.get(COOKIES.ACCESS_TOKEN)) {
    //   user = await queryClient.ensureQueryData(getAuthMeQueryOptions()).catch(() => null);

    //   await Promise.all([
    //     queryClient.ensureQueryData(getFavoritesQueryOptions()).catch(() => []),
    //     queryClient.ensureQueryData(getCartListQueryOptions()).catch(() => [])
    //   ]);
    // }

    // return { user, favorites: [], cart: [] };

    return { user: null as User | null, favorites: [], cart: [] };
  }
});