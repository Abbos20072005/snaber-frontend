// ============================================================================
// FEATURE DISABLED: Admin — chat center.
// ============================================================================
// Original implementation is commented out below. The route is kept as a stub
// that redirects to the admin dashboard.
//
// import { createFileRoute } from '@tanstack/react-router';
//
// import { ChatsPage } from '@/modules/chat';
//
// export const Route = createFileRoute('/admin/chats/')({
//   component: () => <ChatsPage contentHeightClassName='h-[calc(100vh-69px)]' />
// });

import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/chats/')({
  component: () => <Navigate to='/admin/dashboard' />
});
