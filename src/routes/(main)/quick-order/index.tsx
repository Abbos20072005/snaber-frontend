import { useLingui } from '@lingui/react/macro';
import { createFileRoute } from '@tanstack/react-router';

import { QuickOrder } from '@/modules/quick-order';
import { GeneralError, NotFoundError } from '@/shared/ui/errors';
import { PageLoading } from '@/shared/ui/page';
import { SectionWrapper } from '@/shared/ui/section-wrapper';

const QuickOrderPage = () => {
  const { t } = useLingui();

  return (
    <SectionWrapper
      title={t`Order by list`}
      description={t`Do not search product by product. Send your list and we will match it with the catalog.`}
    >
      <QuickOrder />
    </SectionWrapper>
  );
};

export const Route = createFileRoute('/(main)/quick-order/')({
  component: QuickOrderPage,
  pendingComponent: PageLoading,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError
});
