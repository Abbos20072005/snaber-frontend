import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ProductVariantForm } from '@/modules/products';
import { PRODUCT_QUERY_KEYS } from '@/modules/products/options';
import { patchProductVariant, postProductVariant } from '@/shared/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';

import type { ProductVariantSchemaForm } from './constants';

import { productVariantFormToFormData } from './constants';

interface Props {
  defaultValues?: ProductVariant;
  editValues?: ProductVariant;
  open: boolean;
  product: Product;
  onOpenChange: (open: boolean) => void;
}

export const ProductVariantDialog = ({
  defaultValues,
  editValues,
  open,
  product,
  onOpenChange
}: Props) => {
  const { t } = useLingui();
  const isEdit = !!editValues;

  const productVariantPostMutation = useMutation({
    mutationFn: postProductVariant,
    onSuccess: () => {
      onOpenChange(false);
      toast.success(t`Successfully created.`);
    },
    onError: () => toast.error(t`Failed to create product variant.`),
    meta: {
      invalidatesQuery: [...PRODUCT_QUERY_KEYS.base()],
      withoutToastOnError: true
    }
  });

  const productVariantPatchMutation = useMutation({
    mutationFn: patchProductVariant,
    onSuccess: () => {
      onOpenChange(false);
      toast.success(t`Successfully updated.`);
    },
    onError: () => toast.error(t`Failed to update product variant.`),
    meta: {
      invalidatesQuery: [...PRODUCT_QUERY_KEYS.base()],
      withoutToastOnError: true
    }
  });

  const onSubmit = (values: ProductVariantSchemaForm) => {
    const data = productVariantFormToFormData(values);

    if (isEdit) {
      data.append('variant_product_constructor', String(editValues.variant_constructor_id));
      productVariantPatchMutation.mutate({
        data,
        id: editValues?.variant_constructor_id
      });
      return;
    }

    productVariantPostMutation.mutate({ data });
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className='max-h-[90dvh] overflow-y-auto sm:max-w-5xl'>
        <DialogHeader>
          <DialogTitle>{isEdit ? t`Update variant` : t`Create variant`}</DialogTitle>
        </DialogHeader>
        <ProductVariantForm
          defaultValues={editValues ?? defaultValues}
          isLoading={productVariantPatchMutation.isPending || productVariantPostMutation.isPending}
          onSubmit={onSubmit}
          product={product}
        />
      </DialogContent>
    </Dialog>
  );
};
