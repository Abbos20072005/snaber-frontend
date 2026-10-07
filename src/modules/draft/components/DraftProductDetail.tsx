import { useLingui } from '@lingui/react/macro';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { Link, redirect } from '@tanstack/react-router';
import { AlertCircleIcon, ArrowLeftIcon, CheckIcon, PencilIcon, SendIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { DraftProductRejectDialog } from '@/modules/draft';
import {
  getDraftProductByIdQueryOptions,
  PRODUCT_QUERY_KEYS,
  ProductDetailView,
  ProductDialog
} from '@/modules/products';
import { patchProductDraft } from '@/shared/api';
import { Badge } from '@/shared/ui/badge';
import { Button, buttonVariants } from '@/shared/ui/button';
import { PageContent, PageHeader } from '@/shared/ui/page';

import { productDraftStatusColorMap, productDraftStatusLabelMap } from '../constants';

interface Props {
  id: number;
  mode: 'admin' | 'seller';
  returnUrl: '/admin/product-checks' | '/seller/product-checks';
}

export const DraftProductDetail = ({ id, mode, returnUrl }: Props) => {
  const { t } = useLingui();
  const [baseDialogOpen, setBaseDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState<boolean>(false);

  const draftProductQuery = useSuspenseQuery(getDraftProductByIdQueryOptions({ id }));
  const product = draftProductQuery.data.data;

  const patchDraftProductMutation = useMutation({
    mutationFn: patchProductDraft,
    onSuccess: (data) => {
      const { status } = data.data;
      setRejectDialogOpen(false);
      toast.success(t`Successfully updated.`);

      if (status === 'accepted' && mode === 'admin')
        throw redirect({ to: '/admin/product-checks' });
    },
    meta: {
      invalidatesQuery: PRODUCT_QUERY_KEYS.base(),
      withoutToastOnError: true
    }
  });

  const updateStatus = (status: ProductDraftStatus, moderatorComment?: string) => {
    patchDraftProductMutation.mutate({
      id: product.constructor_id,
      data: {
        status,
        ...(moderatorComment ? { moderator_comment: moderatorComment } : {})
      }
    });
  };

  return (
    <>
      <PageHeader className='mx-auto flex w-full max-w-6xl items-center justify-between'>
        <Link className={buttonVariants({ variant: 'outline' })} to={returnUrl}>
          <ArrowLeftIcon />
          {mode === 'admin' ? t`Product checks` : t`Draft products`}
        </Link>
        {mode === 'admin' ? (
          <div className='flex items-center gap-2'>
            <Button variant='outline' onClick={() => setBaseDialogOpen(true)}>
              <PencilIcon />
              {t`Edit`}
            </Button>
            <Button
              variant='successLight'
              loading={
                patchDraftProductMutation.isPending &&
                patchDraftProductMutation.variables?.data.status === 'accepted'
              }
              onClick={() => updateStatus('accepted')}
            >
              <CheckIcon />
              {t`Accept`}
            </Button>
            <Button variant='destructive' onClick={() => setRejectDialogOpen(true)}>
              <XIcon />
              {t`Reject`}
            </Button>
          </div>
        ) : (
          <div className='flex items-center gap-2'>
            <Button variant='outline' onClick={() => setBaseDialogOpen(true)}>
              <PencilIcon />
              {t`Edit`}
            </Button>
            <Button
              variant='primaryLight'
              loading={
                patchDraftProductMutation.isPending &&
                patchDraftProductMutation.variables?.data.status === 'reviewing'
              }
              onClick={() => updateStatus('reviewing')}
            >
              <SendIcon />
              {t`Send to admin`}
            </Button>
          </div>
        )}
      </PageHeader>
      <PageContent className='mx-auto w-full max-w-6xl space-y-4'>
        <div className='flex flex-col gap-3'>
          <Badge
            style={{
              color: productDraftStatusColorMap[product.status],
              backgroundColor: `${productDraftStatusColorMap[product.status]}20`
            }}
            className='self-end font-mono text-xs'
          >
            {t(productDraftStatusLabelMap[product.status])}
          </Badge>
          {product.moderator_comment && (
            <div className='border-destructive/15 bg-destructive/10 text-destructive flex min-h-10 items-center gap-3 rounded-md border px-4 py-2.5 text-sm font-medium'>
              <AlertCircleIcon className='size-4 shrink-0' />
              <p>{product.moderator_comment}</p>
            </div>
          )}
        </div>
        <ProductDetailView url={returnUrl} enableActions product={product} />
        <ProductDialog
          editValues={product}
          onOpenChange={setBaseDialogOpen}
          open={baseDialogOpen}
        />
        <DraftProductRejectDialog
          isLoading={patchDraftProductMutation.isPending}
          onOpenChange={setRejectDialogOpen}
          onSubmit={(value) => updateStatus('returned_for_correction', value.moderator_comment)}
          open={rejectDialogOpen}
        />
      </PageContent>
    </>
  );
};
