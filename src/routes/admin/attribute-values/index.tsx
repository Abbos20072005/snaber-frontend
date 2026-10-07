import { createFileRoute } from '@tanstack/react-router';

import { AttributeValuesAdminPage } from '@/modules/attributes';
import { GeneralError, NotFoundError } from '@/shared/ui/errors';
import { PageLoading } from '@/shared/ui/page';

export const Route = createFileRoute('/admin/attribute-values/')({
  component: AttributeValuesAdminPage,
  pendingComponent: PageLoading,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError
});
