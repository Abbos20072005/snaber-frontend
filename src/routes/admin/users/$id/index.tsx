import { createFileRoute, useParams } from '@tanstack/react-router';

import { UserDetail } from '@/modules/users';
import { GeneralError, NotFoundError } from '@/shared/ui/errors';
import { PageContent, PageLoading } from '@/shared/ui/page';

const UserDetailPage = () => {
  const params = useParams({ from: '/admin/users/$id/' });

  return (
    <PageContent>
      <UserDetail id={+params.id} />
    </PageContent>
  );
};

export const Route = createFileRoute('/admin/users/$id/')({
  component: UserDetailPage,
  pendingComponent: PageLoading,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError
});
