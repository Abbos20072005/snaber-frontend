import { createFileRoute } from '@tanstack/react-router';

import { getUsersQueryOptions, UsersTable } from '@/modules/users';
import { PageContent } from '@/shared/ui/page';

const UsersPage = () => {
  return (
    <PageContent>
      <UsersTable />
    </PageContent>
  );
};

export const Route = createFileRoute('/admin/users/')({
  component: UsersPage,
  loader: ({ context: { queryClient } }) =>
    queryClient.prefetchQuery(
      getUsersQueryOptions({
        params: {
          page: 1,
          page_size: 10
        }
      })
    )
});
