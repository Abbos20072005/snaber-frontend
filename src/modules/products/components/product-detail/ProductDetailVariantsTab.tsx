import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { ImageIcon, PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { deleteProductDraftVariant } from '@/shared/api';
import useFancybox from '@/shared/hooks/useFancybox';
import { formatPrice } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
import { Button, buttonVariants } from '@/shared/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/ui/card';
import { DeleteAlertDialog } from '@/shared/ui/delete-alert-dialog';
import { Separator } from '@/shared/ui/separator';

import { PRODUCT_QUERY_KEYS } from '../../options';
import { ProductVariantDialog } from '../ProductVariantForm';
import { ProductDetailInfoRow } from './ProductDetailInfoRow';

interface Props {
  enableActions?: boolean;
  product: Product;
  url?: '/admin/product-checks' | '/admin/products' | '/seller/product-checks' | '/seller/products';
}

export const ProductDetailVariantsTab = ({ enableActions = true, product, url }: Props) => {
  const { t } = useLingui();
  const { fancyboxRef } = useFancybox();

  const [variantDialogOpen, setVariantDialogOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | undefined>();
  const [deletingVariant, setDeletingVariant] = useState<ProductVariant | undefined>();
  const createVariantRoute = !url
    ? undefined
    : url === '/admin/product-checks'
      ? '/admin/product-checks/$id/variants/create'
      : url === '/seller/product-checks'
        ? '/seller/product-checks/$id/variants/create'
        : undefined;
  const updateVariantRoute = !url
    ? undefined
    : url === '/admin/product-checks'
      ? '/admin/product-checks/$id/variants/$variantId'
      : url === '/seller/product-checks'
        ? '/seller/product-checks/$id/variants/$variantId'
        : undefined;

  const openEditVariant = (variant: ProductVariant) => {
    setEditingVariant(variant);
    setVariantDialogOpen(true);
  };

  const openCreateVariant = () => {
    setEditingVariant(undefined);
    setVariantDialogOpen(true);
  };

  const createVariantButton = createVariantRoute ? (
    <Link
      className={buttonVariants()}
      params={{ id: String(product.constructor_id) }}
      to={createVariantRoute}
    >
      <PlusIcon />
      {t`Add variant`}
    </Link>
  ) : (
    <Button size='sm' onClick={openCreateVariant}>
      <PlusIcon />
      {t`Add variant`}
    </Button>
  );

  const getEditVariantButton = (variant: ProductVariant) =>
    updateVariantRoute ? (
      <Link
        className={buttonVariants({ size: 'icon-sm', variant: 'outline' })}
        params={{ id: String(product.constructor_id), variantId: String(variant.id) }}
        to={updateVariantRoute}
      >
        <PencilIcon />
      </Link>
    ) : (
      <Button size='icon-sm' variant='outline' onClick={() => openEditVariant(variant)}>
        <PencilIcon />
      </Button>
    );

  const cardHeader = (
    <CardHeader>
      <CardTitle>{t`Product variants`}</CardTitle>
      <CardDescription>{t`SKU, stock, override pricing, media and attributes.`}</CardDescription>
      {enableActions && <CardAction>{createVariantButton}</CardAction>}
    </CardHeader>
  );

  const deleteVariantMutation = useMutation({
    mutationFn: deleteProductDraftVariant,
    onSuccess: () => {
      setDeletingVariant(undefined);
      toast.success(t`Successfully deleted variant.`);
    },
    onError: () => toast.error(t`Failed to delete variant.`),
    meta: {
      invalidatesQuery: [...PRODUCT_QUERY_KEYS.base()],
      withoutToastOnError: true
    }
  });

  return (
    <>
      {product.variants.length === 0 ? (
        <Card>
          {cardHeader}
          <CardContent className='py-10 text-center'>
            <p className='border-border text-muted-foreground rounded-md border border-dashed p-6 text-center text-sm'>
              {t`No variants added for this product.`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>{cardHeader}</Card>
          <div className='grid gap-4'>
            {product.variants.map((variant) => {
              const variantPrice = variant.price_override;

              return (
                <Card key={variant.id}>
                  <CardHeader className='border-b'>
                    <Badge className='mb-2' variant={variant.is_active ? 'success' : 'outline'}>
                      {variant.is_active ? t`Active` : t`Inactive`}
                    </Badge>
                    <div className='flex flex-wrap items-start justify-between gap-3'>
                      <div>
                        <CardTitle>{variant.sku_variant}</CardTitle>
                        <CardDescription>
                          {variant.is_active ? t`Active variant` : t`Inactive variant`}
                        </CardDescription>
                      </div>
                      {enableActions && (
                        <div className='flex items-center gap-2'>
                          {getEditVariantButton(variant)}
                          <Button
                            size='icon-sm'
                            variant='destructive'
                            onClick={() => setDeletingVariant(variant)}
                          >
                            <Trash2Icon />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-3'>
                    <div className='grid items-center gap-3 sm:grid-cols-2 lg:grid-cols-4'>
                      <ProductDetailInfoRow label={t`Variant ID`} value={variant.id} />
                      <ProductDetailInfoRow
                        label={t`Stock`}
                        value={formatPrice(variant.stock_quantity)}
                      />
                      <ProductDetailInfoRow
                        label={t`Variant MOQ`}
                        value={`${formatPrice(variant.moq_override)} ${product.moq_unit.unit}`}
                      />
                      <ProductDetailInfoRow
                        label={t`Variant price`}
                        value={variantPrice > 0 ? `$${formatPrice(variantPrice)}` : t`On request`}
                      />
                    </div>
                    {variant.characteristics.length > 0 && (
                      <>
                        <Separator />
                        <div className='space-y-2'>
                          <p className='text-sm font-medium'>{t`Characteristics`}</p>
                          <div className='flex flex-wrap gap-2'>
                            {variant.characteristics.map((characteristic) => (
                              <Badge
                                key={`${characteristic.name}-${characteristic.value}`}
                                variant='outline'
                              >
                                {characteristic.name}: {characteristic.value}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                    {variant.attributes.length > 0 && (
                      <>
                        <Separator />
                        <div className='space-y-2'>
                          <p className='text-sm font-medium'>{t`Attributes`}</p>
                          <div className='flex flex-wrap gap-2'>
                            {variant.attributes.map((attribute) => (
                              <Badge key={attribute.id} variant='outline'>
                                {attribute.name}: {attribute.value.value}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                    {variant.medias.length > 0 && (
                      <>
                        <Separator />
                        <div className='flex items-center gap-2 text-sm font-medium'>
                          <ImageIcon className='size-4' />
                          {t`Media`}
                        </div>
                        <div
                          ref={fancyboxRef}
                          className='grid grid-cols-[repeat(auto-fill,minmax(112px,1fr))] gap-3'
                        >
                          {variant.medias.map((media) => (
                            <a
                              href={media.file}
                              key={media.file}
                              data-type={
                                media.product_media_type === 'video' ? 'html5video' : undefined
                              }
                              aria-label={`${variant.sku_variant} ${media.product_media_type}`}
                              className='group block aspect-square overflow-hidden rounded-md border'
                              data-caption={`${variant.sku_variant} · ${media.product_media_type}`}
                              data-fancybox={`variant-media-${variant.id}`}
                            >
                              {media.product_media_type === 'video' ? (
                                <video
                                  muted
                                  playsInline
                                  className='h-28 w-full object-cover transition duration-300 group-hover:scale-105'
                                  src={media.file}
                                />
                              ) : (
                                <img
                                  alt={variant.sku_variant}
                                  className='h-28 w-full object-cover transition duration-300 group-hover:scale-105'
                                  src={media.file}
                                />
                              )}
                            </a>
                          ))}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {enableActions && (
        <>
          <ProductVariantDialog
            editValues={editingVariant}
            onOpenChange={setVariantDialogOpen}
            open={variantDialogOpen}
            product={product}
          />
          <DeleteAlertDialog
            itemName={deletingVariant?.sku_variant}
            title={t`Delete variant`}
            description={t`Are you sure you want to delete this variant? This action cannot be undone.`}
            isLoading={deleteVariantMutation.isPending}
            onDelete={() => {
              if (deletingVariant)
                deleteVariantMutation.mutate({
                  id: deletingVariant.constructor_id ?? deletingVariant.variant_constructor_id
                });
            }}
            onOpenChange={(open) => {
              if (!open) setDeletingVariant(undefined);
            }}
            open={!!deletingVariant}
          />
        </>
      )}
    </>
  );
};
