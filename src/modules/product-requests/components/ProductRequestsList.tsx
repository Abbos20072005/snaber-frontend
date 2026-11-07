import { useLingui } from '@lingui/react/macro';
import { useQuery } from '@tanstack/react-query';
import { ClipboardListIcon, PaperclipIcon } from 'lucide-react';

import {
  getProductRequestsQueryOptions,
  productRequestStatusLabelMap,
  productRequestStatusVariantMap
} from '@/modules/product-requests';
import { formatLocaleDate } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/shared/ui/empty';
import { Skeleton } from '@/shared/ui/skeleton';

import { ProductRequestItems } from './ProductRequestItems';

export const ProductRequestsList = () => {
  const { t } = useLingui();
  const requestsQuery = useQuery(getProductRequestsQueryOptions({ params: { page_size: 50 } }));
  const requests = requestsQuery.data?.results ?? [];

  if (requestsQuery.isLoading) return <Skeleton className='h-40 w-full rounded-lg' />;

  if (requests.length === 0)
    return (
      <Empty className='w-full'>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <ClipboardListIcon className='text-muted-foreground' />
          </EmptyMedia>
          <EmptyTitle>{t`No requests yet`}</EmptyTitle>
          <EmptyDescription>
            {t`Products you could not find and asked us about will appear here.`}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );

  return (
    <div className='space-y-4'>
      {requests.map((request) => (
        <Card key={request.id}>
          <CardHeader className='flex flex-wrap items-start justify-between gap-3 border-b'>
            <div>
              <CardTitle className='text-lg'>
                {t`Request`} #{request.id}
              </CardTitle>
              <CardDescription>{formatLocaleDate(request.created_at, 'PP HH:mm')}</CardDescription>
            </div>
            <Badge variant={productRequestStatusVariantMap[request.status]}>
              {t(productRequestStatusLabelMap[request.status])}
            </Badge>
          </CardHeader>
          <CardContent className='space-y-3'>
            <ProductRequestItems items={request.items} />
            {request.comment && <p className='text-muted-foreground text-sm'>{request.comment}</p>}
            {request.file && (
              <a
                href={request.file}
                className='text-primary inline-flex items-center gap-1 text-sm hover:underline'
                rel='noreferrer'
                target='_blank'
              >
                <PaperclipIcon className='size-4' />
                {t`Attached file`}
              </a>
            )}
            {request.answer && (
              <div className='bg-muted rounded-lg p-3 text-sm'>
                <p className='text-muted-foreground mb-1 text-xs'>{t`Our answer`}</p>
                {request.answer}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
