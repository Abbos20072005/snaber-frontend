import { useLingui } from '@lingui/react/macro';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { ArrowLeftIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import type { ProductSchemaForm } from '@/modules/products';

import {
  getProductByIdQueryOptions,
  PRODUCT_QUERY_KEYS,
  ProductForm,
  productFormToDto
} from '@/modules/products';
import { deleteProduct, deleteProductImage, patchProduct, postProductImages } from '@/shared/api';
import { Button, buttonVariants } from '@/shared/ui/button';
import { DeleteAlertDialog } from '@/shared/ui/delete-alert-dialog';
import { PageContent, PageHeader } from '@/shared/ui/page';

interface Props {
  id: number;
}

export const ProductEdit = ({ id }: Props) => {
  const { t } = useLingui();
  const navigate = useNavigate();
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);

  const productQuery = useSuspenseQuery(getProductByIdQueryOptions({ id }));
  const product = productQuery.data.data;

  const productPatchMutation = useMutation({
    mutationFn: async (values: ProductSchemaForm) => {
      await patchProduct({ id, data: productFormToDto(values) });

      if (values.images.length > 0) await postProductImages({ id, files: values.images });
    },
    onSuccess: () => toast.success(t`Successfully updated.`),
    onError: () => toast.error(t`Failed to update product.`),
    meta: {
      invalidatesQuery: [...PRODUCT_QUERY_KEYS.base()],
      withoutToastOnError: true
    }
  });

  const deleteImageMutation = useMutation({
    mutationFn: (media: ProductMedia) => deleteProductImage({ id, imageId: media.id }),
    onError: () => toast.error(t`Failed to delete image.`),
    meta: {
      invalidatesQuery: [...PRODUCT_QUERY_KEYS.base()],
      withoutToastOnError: true
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: () => deleteProduct({ id }),
    onSuccess: () => {
      toast.success(t`Successfully deleted product.`);
      void navigate({ to: '/admin/products' });
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
      <PageHeader className='mx-auto flex w-full max-w-4xl items-center justify-between'>
        <Link className={buttonVariants({ variant: 'outline' })} to='/admin/products'>
          <ArrowLeftIcon />
          {t`Products`}
        </Link>
        <Button variant='destructive' onClick={() => setDeleteAlertOpen(true)}>
          <Trash2Icon />
          {t`Delete`}
        </Button>
      </PageHeader>
      <PageContent className='mx-auto w-full max-w-4xl'>
        <ProductForm
          // Remount after every save so the form reflects what the server stored.
          key={product.updated_at}
          deletingImageId={
            deleteImageMutation.isPending ? deleteImageMutation.variables.id : undefined
          }
          isLoading={productPatchMutation.isPending}
          onDeleteImage={(media) => deleteImageMutation.mutate(media)}
          onSubmit={(values) => productPatchMutation.mutate(values)}
          product={product}
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
