import { useLingui } from '@lingui/react/macro';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeftIcon, ClipboardListIcon } from 'lucide-react';

import { ProductRequestsList } from '@/modules/product-requests';
import { GeneralError, NotFoundError } from '@/shared/ui/errors';
import { PageLoading } from '@/shared/ui/page';
import { SectionWrapper } from '@/shared/ui/section-wrapper';

const RequestsPage = () => {
  const { t } = useLingui();

  return (
    <>
      <SectionWrapper
        className='md:hidden'
        content={
          <>
            <h2 className='text-primary flex items-center gap-1.5 text-xl font-bold'>
              <Link className='flex items-center gap-1 text-xs md:text-base' to='/profile'>
                <ArrowLeftIcon className='size-4' />
              </Link>
              <ClipboardListIcon className='size-5' />
              {t`Requests`}
            </h2>
          </>
        }
        isLoggedIn={true}
      >
        <ProductRequestsList />
      </SectionWrapper>
      <section className='hidden space-y-4 md:block'>
        <ProductRequestsList />
      </section>
    </>
  );
};

export const Route = createFileRoute('/(main)/profile/requests')({
  component: RequestsPage,
  pendingComponent: PageLoading,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError
});
