import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { PRODUCT_QUERY_KEYS } from '@/modules/products/options';
import { patchProduct, postProduct } from '@/shared/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';

import type { ProductSchemaForm } from './constants';

import { productFormToDto } from './constants';
import { ProductForm } from './ProductForm';

interface Props {
  defaultValues?: Partial<Product>;
  editValues?: Product;
  open: boolean;
  onCreated?: (product: Product) => void;
  onOpenChange: (open: boolean) => void;
}

export const ProductDialog = ({
  defaultValues,
  editValues,
  open,
  onCreated,
  onOpenChange
}: Props) => {
  const { t } = useLingui();
  const isEdit = !!editValues;

  const productPostMutation = useMutation({
    mutationFn: postProduct,
    onSuccess: ({ data: product }) => {
      onOpenChange(false);
      onCreated?.(product);
      toast.success(t`Successfully created.`);
    },
    onError: () => toast.error(t`Failed to create product.`),
    meta: {
      invalidatesQuery: [...PRODUCT_QUERY_KEYS.base()],
      withoutToastOnError: true
    }
  });

  const productPatchMutation = useMutation({
    mutationFn: patchProduct,
    onSuccess: () => {
      onOpenChange(false);
      toast.success(t`Successfully updated.`);
    },
    onError: () => toast.error(t`Failed to update product.`),
    meta: {
      invalidatesQuery: [...PRODUCT_QUERY_KEYS.base()],
      withoutToastOnError: true
    }
  });

  const onSubmit = (values: ProductSchemaForm) => {
    const data = productFormToDto(values);

    if (isEdit) {
      productPatchMutation.mutate({
        data,
        id: editValues?.constructor_id
      });
      return;
    }

    productPostMutation.mutate({ data });
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className='sm:max-w-5xl'>
        <DialogHeader>
          <DialogTitle>{isEdit ? t`Update product` : t`Create product`}</DialogTitle>
        </DialogHeader>
        <ProductForm
          defaultValues={editValues ?? defaultValues}
          isLoading={productPatchMutation.isPending || productPostMutation.isPending}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};
