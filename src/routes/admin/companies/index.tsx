// ============================================================================
// FEATURE DISABLED: Admin — company drafts moderation.
// ============================================================================
// Original implementation is commented out below. The route is kept as a stub
// that redirects to the admin dashboard.
//
// import { createFileRoute } from '@tanstack/react-router';
//
// import { CompaniesTable } from '@/modules/company';
// import { PageContent } from '@/shared/ui/page';
//
// const RouteComponent = () => {
//   return (
//     <PageContent>
//       <CompaniesTable />
//     </PageContent>
//   );
// };
// export const Route = createFileRoute('/admin/companies/')({
//   component: RouteComponent
// });

import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/companies/')({
  component: () => <Navigate to='/admin/dashboard' />
});
