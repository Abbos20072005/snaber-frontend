import { useLingui } from '@lingui/react/macro';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { ArrowLeftIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import {
  getProductByIdQueryOptions,
  PRODUCT_QUERY_KEYS,
  ProductDetailView,
  ProductDialog
} from '@/modules/products';
import { deleteProduct } from '@/shared/api';
import { Button, buttonVariants } from '@/shared/ui/button';
import { DeleteAlertDialog } from '@/shared/ui/delete-alert-dialog';
import { PageContent, PageHeader } from '@/shared/ui/page';

interface Props {
  enableActions?: boolean;
  id: number;
  url: '/admin/products' | '/seller/products';
}

export const ProductDetail = ({ id, url, enableActions = true }: Props) => {
  const { t } = useLingui();

  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [baseDialogOpen, setBaseDialogOpen] = useState(false);
  const navigate = useNavigate();
  const productQuery = useSuspenseQuery(getProductByIdQueryOptions({ id }));
  const product = productQuery.data.data;

  const deleteProductMutation = useMutation({
    mutationFn: () => deleteProduct({ id }),
    onSuccess: () => {
      toast.success(t`Successfully deleted product.`);
      void navigate({ to: url });
    },
    onError: () => toast.error(t`Failed to delete product. Please try again.`),
    onSettled: () => setDeleteAlertOpen(false),
    meta: {
      invalidatesQuery: [...PRODUCT_QUERY_KEYS.base()],
      withoutToastOnError: true
    }
  });
  return (
    <>
      <PageHeader className='mx-auto flex w-full max-w-6xl items-center justify-between'>
        <Link className={buttonVariants({ variant: 'outline' })} to={url}>
          <ArrowLeftIcon />
          {t`Products`}
        </Link>
        {enableActions && (
          <div className='flex items-center gap-2'>
            <Button variant='outline' onClick={() => setBaseDialogOpen(true)}>
              <PencilIcon />
              {t`Edit`}
            </Button>
            <Button variant='destructive' onClick={() => setDeleteAlertOpen(true)}>
              <Trash2Icon />
              {t`Delete`}
            </Button>
          </div>
        )}
      </PageHeader>
      <PageContent className='mx-auto w-full max-w-6xl space-y-4'>
        <ProductDetailView url={url} enableActions={enableActions} product={product} />
        <ProductDialog
          editValues={product}
          onOpenChange={setBaseDialogOpen}
          open={baseDialogOpen}
        />
        <DeleteAlertDialog
          itemName={product.name}
          title={t`Delete product`}
          description={t`Are you sure you want to delete this product? This action cannot be undone.`}
          isLoading={deleteProductMutation.isPending}
          onDelete={deleteProductMutation.mutate}
          onOpenChange={setDeleteAlertOpen}
          open={deleteAlertOpen}
        />
      </PageContent>
    </>
  );
};
