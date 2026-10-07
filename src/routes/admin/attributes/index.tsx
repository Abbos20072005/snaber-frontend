import { createFileRoute } from '@tanstack/react-router';

import { AttributesAdminPage } from '@/modules/attributes';
import { GeneralError, NotFoundError } from '@/shared/ui/errors';
import { PageLoading } from '@/shared/ui/page';

export const Route = createFileRoute('/admin/attributes/')({
  component: AttributesAdminPage,
  pendingComponent: PageLoading,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError
});
