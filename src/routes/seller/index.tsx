import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/seller/')({
  loader: () => {
    throw redirect({ to: '/seller/dashboard' });
  }
});
