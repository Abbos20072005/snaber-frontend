import { useLingui } from '@lingui/react/macro';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { ArrowLeftIcon, BoxesIcon } from 'lucide-react';
import { toast } from 'sonner';

import type { ProductVariantSchemaForm } from '@/modules/products';

import {
  getDraftProductByIdQueryOptions,
  PRODUCT_QUERY_KEYS,
  ProductVariantForm,
  productVariantFormToFormData
} from '@/modules/products';
import { patchProductVariant, postProductVariant } from '@/shared/api';
import { buttonVariants } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { NotFoundError } from '@/shared/ui/errors';
import { PageContent, PageHeader } from '@/shared/ui/page';

interface Props {
  constructorId: number;
  url: '/admin/product-checks' | '/seller/product-checks';
  variantId?: number;
}

export const ProductVariantUpsert = ({ constructorId, url, variantId }: Props) => {
  const { t } = useLingui();
  const navigate = useNavigate();
  const productQuery = useSuspenseQuery(getDraftProductByIdQueryOptions({ id: constructorId }));
  const product = productQuery.data.data;
  const variant = variantId ? product.variants.find((item) => item.id === variantId) : undefined;
  const isEdit = !!variantId;

  const navigateToProduct = () =>
    navigate({
      to:
        url === '/admin/product-checks'
          ? '/admin/product-checks/$id'
          : '/seller/product-checks/$id',
      params: { id: String(constructorId) }
    });

  const productVariantPostMutation = useMutation({
    mutationFn: postProductVariant,
    onSuccess: () => {
      toast.success(t`Successfully created.`);
      void navigateToProduct();
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
      toast.success(t`Successfully updated.`);
      void navigateToProduct();
    },
    onError: () => toast.error(t`Failed to update product variant.`),
    meta: {
      invalidatesQuery: [...PRODUCT_QUERY_KEYS.base()],
      withoutToastOnError: true
    }
  });

  const onSubmit = (values: ProductVariantSchemaForm) => {
    const data = productVariantFormToFormData(values);
    data.append('product_constructor', String(product.constructor_id));

    if (variant) {
      productVariantPatchMutation.mutate({
        data,
        id: variant.id
      });
      return;
    }

    productVariantPostMutation.mutate({ data });
  };

  if (isEdit && !variant) return <NotFoundError />;

  return (
    <>
      <PageHeader className='h-fit flex-col items-start pt-4'>
        <Link
          className={buttonVariants({ variant: 'outline' })}
          params={{ id: String(constructorId) }}
          to={
            url === '/admin/product-checks'
              ? '/admin/product-checks/$id'
              : '/seller/product-checks/$id'
          }
        >
          <ArrowLeftIcon />
          {t`Product`}
        </Link>
        <div className='grid gap-2'>
          <div className='flex items-center gap-3'>
            <div className='bg-primary/10 text-primary grid size-10 place-items-center rounded-md'>
              <BoxesIcon className='size-5' />
            </div>
            <div>
              <h1 className='font-heading text-2xl font-semibold'>
                {isEdit ? t`Update variant` : t`Create variant`}
              </h1>
              <p className='text-muted-foreground text-sm'>
                {t`Manage SKU, stock, override pricing, media and attributes.`}
              </p>
            </div>
          </div>
        </div>
      </PageHeader>
      <PageContent>
        <Card>
          <CardHeader>
            <CardTitle>{isEdit ? t`Variant fields` : t`New variant`}</CardTitle>
            <CardDescription>{product.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <ProductVariantForm
              defaultValues={variant}
              isLoading={
                productVariantPatchMutation.isPending || productVariantPostMutation.isPending
              }
              onSubmit={onSubmit}
              product={product}
              productValue={product.constructor_id}
            />
          </CardContent>
        </Card>
      </PageContent>
    </>
  );
};
