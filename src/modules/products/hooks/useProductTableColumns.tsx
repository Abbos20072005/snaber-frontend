import type { ColumnDef } from '@tanstack/react-table';

import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { useAuthed } from '@/modules/auth';
import {
  PRODUCT_QUERY_KEYS,
  productTypeColorMap,
  productTypeLabelMap,
  productTypeOptions
} from '@/modules/products';
import { deleteProduct } from '@/shared/api';
import useFancybox from '@/shared/hooks/useFancybox';
import { formatLocaleDate, formatPrice } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { DeleteAlertDialog } from '@/shared/ui/delete-alert-dialog';

const ProductCell = ({ product, url }: { product: ProductPreview; url: string }) => {
  const { fancyboxRef } = useFancybox();
  const productId = product.product_id ?? product.id;

  return (
    <div ref={fancyboxRef} className='flex min-w-80 items-center gap-3'>
      {product.image && (
        <a
          href={product.image}
          aria-label={product.name}
          data-caption={product.name}
          data-fancybox={`product-${productId}`}
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
          id: String(productId)
        }}
        className='text-primary truncate font-medium underline'
        to={url}
      >
        {product.name}
      </Link>
    </div>
  );
};

export const useProductTableColumns = (): ColumnDef<ProductPreview>[] => {
  const { t } = useLingui();
  const { user } = useAuthed();
  const url = user.role === 'seller' ? '/seller/products/$id' : '/admin/products/$id';

  return [
    {
      id: 'search',
      accessorKey: 'name',
      header: t`Product`,
      cell: ({ row }) => {
        const product = row.original;

        return <ProductCell url={url} product={product} />;
      },
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
      cell: ({ row }) => <span className='font-mono text-xs'>{row.original.sku}</span>
    },
    {
      id: 'industries',
      header: t`Industries`,
      cell: ({ row }) => (
        <div className='flex gap-2 space-y-1'>
          {row.original.industries.slice(0, 2).map((industry) => (
            <Badge key={industry.id} variant={'secondary'}>
              {industry.name}
            </Badge>
          )) || '-'}
          <Badge variant='secondary'>+{row.original.industries.length - 2}</Badge>
        </div>
      )
    },
    {
      id: 'price',
      header: t`Price`,
      cell: ({ row }) => {
        const product = row.original;

        if (product.price_type === 'on_request')
          return <Badge variant='outline'>{t`On request`}</Badge>;

        if (product.price_type === 'exact') return <span>{formatPrice(product.price_min)}</span>;

        return (
          <span>
            {formatPrice(product.price_min)} - {formatPrice(product.price_max)}
          </span>
        );
      }
    },
    {
      id: 'moq',
      header: 'MOQ',
      cell: ({ row }) => formatPrice(row.original.moq)
    },
    {
      id: 'lead_time',
      header: t`Lead Time`,
      cell: ({ row }) => {
        const { lead_time_min, lead_time_max } = row.original;
        if (lead_time_min === lead_time_max) {
          return `${lead_time_min} ${t`days`}`;
        }
        return `${lead_time_min}-${lead_time_max} ${t`days`}`;
      }
    },
    {
      id: 'product_type',
      accessorKey: 'product_type',
      header: t`Type`,
      cell: ({ row }) => {
        const value = row.original.product_type;
        const color = productTypeColorMap[value];

        return (
          <Badge
            style={{
              color,
              backgroundColor: `${color}20`
            }}
          >
            {t(productTypeLabelMap[value])}
          </Badge>
        );
      },
      meta: {
        variant: 'select',
        label: t`Type`,
        options: productTypeOptions.map((item) => ({
          label: t(productTypeLabelMap[item.value]),
          value: item.value
        }))
      },
      enableColumnFilter: true
    },
    {
      id: 'variants',
      header: t`Variants`,
      cell: ({ row }) => {
        const variantsCount = row.original.variants;
        return <div className='font-medium'>{variantsCount}</div>;
      }
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

        const deleteCategoryMutation = useMutation({
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
              isLoading={deleteCategoryMutation.isPending}
              onDelete={() => deleteCategoryMutation.mutate({ id: row.original.id })}
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
