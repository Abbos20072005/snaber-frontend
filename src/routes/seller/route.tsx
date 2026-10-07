import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import { getAuthMeQueryOptions } from '@/modules/auth';
import { AppSidebar, SellerHeader, useSidebarData } from '@/routes/seller/-components';
import { SearchProvider } from '@/shared/context';
import { SidebarInset, SidebarProvider } from '@/shared/ui/sidebar';

const AuthGuardLayout = () => {
  return (
    <SearchProvider sidebarData={useSidebarData()}>
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <SidebarInset>
          <SellerHeader />
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </SearchProvider>
  );
};

export const Route = createFileRoute('/seller')({
  component: AuthGuardLayout,
  ssr: false,
  loader: async ({ context: { queryClient } }) => {
    const user = await queryClient.ensureQueryData(getAuthMeQueryOptions()).catch(() => {
      throw redirect({ to: '/' });
    });

    if (user.role === 'seller') return;

    if (user.role === 'admin' || user.role === 'super_admin')
      throw redirect({ to: '/admin/dashboard' });

    throw redirect({ to: '/' });
  }
});
