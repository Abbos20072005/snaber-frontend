import type { ColumnDef } from '@tanstack/react-table';

import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { PRODUCT_QUERY_KEYS } from '@/modules/products';
import { deleteProduct } from '@/shared/api';
import useFancybox from '@/shared/hooks/useFancybox';
import { formatLocaleDate, formatPrice } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { DeleteAlertDialog } from '@/shared/ui/delete-alert-dialog';

const ProductCell = ({ product }: { product: ProductPreview }) => {
  const { fancyboxRef } = useFancybox();

  return (
    <div ref={fancyboxRef} className='flex min-w-80 items-center gap-3'>
      {product.image && (
        <a
          href={product.image}
          aria-label={product.name}
          data-caption={product.name}
          data-fancybox={`product-${product.id}`}
          onClick={(event) => event.stopPropagation()}
        >
          <img
            alt={product.name}
            className='size-10 rounded-md border object-cover'
            src={product.image}
          />
        </a>
      )}
      <Link
        params={{
          id: String(product.id)
        }}
        className='text-primary truncate font-medium underline'
        to='/admin/products/$id'
      >
        {product.name}
      </Link>
    </div>
  );
};

export const useProductTableColumns = (): ColumnDef<ProductPreview>[] => {
  const { t } = useLingui();

  return [
    {
      id: 'search',
      accessorKey: 'name',
      header: t`Product`,
      cell: ({ row }) => <ProductCell product={row.original} />,
      meta: {
        variant: 'text',
        label: t`Search...`
      },
      enableColumnFilter: true
    },
    {
      id: 'sku',
      accessorKey: 'sku',
      header: 'SKU',
      cell: ({ row }) => <span className='font-mono text-xs'>{row.original.sku || '-'}</span>
    },
    {
      id: 'price',
      header: t`Price`,
      cell: ({ row }) => {
        const product = row.original;

        return (
          <div className='flex items-center gap-2'>
            <span>{formatPrice(product.final_price)}</span>
            {product.discount_percent > 0 && (
              <Badge variant='secondary'>-{product.discount_percent}%</Badge>
            )}
          </div>
        );
      }
    },
    {
      id: 'stock_quantity',
      header: t`Stock`,
      cell: ({ row }) => {
        const { stock_quantity, unit } = row.original;

        if (stock_quantity === 0) return <Badge variant='outline'>{t`Out of stock`}</Badge>;

        return `${formatPrice(stock_quantity)} ${unit?.unit ?? ''}`;
      }
    },
    {
      id: 'is_active',
      header: t`Status`,
      cell: ({ row }) =>
        row.original.is_active ? (
          <Badge>{t`Active`}</Badge>
        ) : (
          <Badge variant='outline'>{t`Hidden`}</Badge>
        )
    },
    {
      id: 'updated_at',
      accessorKey: 'updated_at',
      header: t`Updated`,
      cell: ({ row }) => formatLocaleDate(row.original.updated_at, 'PP HH:MM')
    },
    {
      id: 'created_at',
      accessorKey: 'created_at',
      header: t`Created`,
      cell: ({ row }) => formatLocaleDate(row.original.created_at, 'PP HH:MM')
    },
    {
      size: 32,
      id: 'actions',
      cell: function Cell({ row }) {
        const [openDeleteAlert, setDeleteAlert] = useState<boolean>(false);

        const deleteProductMutation = useMutation({
          mutationFn: deleteProduct,
          onSuccess: () => {
            setDeleteAlert(false);
            toast.success(t`Product deleted successfully.`);
          },
          onError: () => toast.error(t`Failed to delete product.`),
          meta: {
            withoutToastOnError: true,
            invalidatesQuery: [...PRODUCT_QUERY_KEYS.base()]
          }
        });

        return (
          <>
            <Button
              size='icon-sm'
              variant='destructiveOutline'
              onClick={() => setDeleteAlert(true)}
            >
              <TrashIcon />
            </Button>
            <DeleteAlertDialog
              title={t`Delete this product?`}
              description={t`Are you sure you want to delete this product? This action cannot be undone.`}
              isLoading={deleteProductMutation.isPending}
              onDelete={() => deleteProductMutation.mutate({ id: row.original.id })}
              onOpenChange={setDeleteAlert}
              open={openDeleteAlert}
            />
          </>
        );
      },
      enablePinning: true
    }
  ];
};
