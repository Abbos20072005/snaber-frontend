import { useLingui } from '@lingui/react/macro';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeftIcon, PackageIcon, SearchIcon } from 'lucide-react';
import { useQueryState } from 'nuqs';

import { GeneralError, NotFoundError } from '@/shared/ui/errors';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/shared/ui/input-group';
import { PageLoading } from '@/shared/ui/page';
import { SectionWrapper } from '@/shared/ui/section-wrapper';

import { OrdersList } from './-components/OrdersList';

const OrdersPage = () => {
  const { t } = useLingui();
  const [search, setSearch] = useQueryState('search', { defaultValue: '' });

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
              <PackageIcon className='size-5' />
              {t`Orders`}
            </h2>
          </>
        }
        isLoggedIn={true}
      >
        <section className='space-y-4'>
          <div className='flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center'>
            <InputGroup className='w-full'>
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <InputGroupInput
                value={search}
                onChange={(event) => setSearch(event.currentTarget.value)}
                placeholder={t`Search`}
              />
            </InputGroup>
          </div>
          <OrdersList />
        </section>
      </SectionWrapper>
      <section className='hidden space-y-4 md:block'>
        <div className='flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center'>
          <InputGroup className='w-full'>
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
              placeholder={t`Search`}
            />
          </InputGroup>
        </div>
        <OrdersList />
      </section>
    </>
  );
};

export const Route = createFileRoute('/(main)/profile/orders/')({
  component: OrdersPage,
  pendingComponent: PageLoading,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError
});
