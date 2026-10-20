import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import { getAuthMeQueryOptions } from '@/modules/auth';
import { AdminHeader, AppSidebar, useSidebarData } from '@/routes/admin/-components';
import { SearchProvider } from '@/shared/context';
import { SidebarInset, SidebarProvider } from '@/shared/ui/sidebar';

const AuthGuardLayout = () => {
  return (
    <SearchProvider sidebarData={useSidebarData()}>
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <SidebarInset>
          <AdminHeader />
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </SearchProvider>
  );
};

export const Route = createFileRoute('/admin')({
  component: AuthGuardLayout,
  ssr: false,
  loader: async ({ context: { queryClient } }) => {
    const user = await queryClient.ensureQueryData(getAuthMeQueryOptions()).catch(() => {
      throw redirect({ to: '/' });
    });

    if (user.role === 'admin') return;

    throw redirect({ to: '/' });
  }
});
