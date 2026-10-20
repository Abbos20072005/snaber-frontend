import { useLingui } from '@lingui/react/macro';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link, useParams } from '@tanstack/react-router';
import { ArrowLeftIcon } from 'lucide-react';

import { getOrderByIdQueryOptions, OrderCard } from '@/modules/order';
import { buttonVariants } from '@/shared/ui/button';
import { GeneralError, NotFoundError } from '@/shared/ui/errors';
import { PageLoading } from '@/shared/ui/page';

const OrderDetailPage = () => {
  const { id } = useParams({ from: '/(main)/profile/orders/$id' });
  const { t } = useLingui();
  const order = useSuspenseQuery(getOrderByIdQueryOptions({ id: +id })).data.data;

  return (
    <section className='md container space-y-4 pb-5 md:w-full md:p-0'>
      <Link className={buttonVariants({ variant: 'ghost' })} to='/profile/orders'>
        <ArrowLeftIcon />
        {t`Back`}
      </Link>
      <OrderCard order={order} />
    </section>
  );
};

export const Route = createFileRoute('/(main)/profile/orders/$id')({
  component: OrderDetailPage,
  pendingComponent: PageLoading,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError
});
