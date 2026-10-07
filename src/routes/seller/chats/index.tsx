// ============================================================================
// FEATURE DISABLED: Seller — chat center.
// ============================================================================
// Original implementation is commented out below. The route is kept as a stub
// that redirects to the seller dashboard.
//
// import { createFileRoute } from '@tanstack/react-router';
//
// import { ChatsPage } from '@/modules/chat';
//
// export const Route = createFileRoute('/seller/chats/')({
//   component: ChatsPage
// });

import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/seller/chats/')({
  component: () => <Navigate to='/seller/dashboard' />
});
