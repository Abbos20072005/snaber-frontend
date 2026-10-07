import type { ColumnDef } from '@tanstack/react-table';

import { useLingui } from '@lingui/react/macro';
import { Link } from '@tanstack/react-router';
import { EyeIcon } from 'lucide-react';

import { productTypeColorMap, productTypeLabelMap } from '@/modules/products';
import useFancybox from '@/shared/hooks/useFancybox';
import { formatLocaleDate, formatPrice } from '@/shared/lib/format';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/badge';
import { buttonVariants } from '@/shared/ui/button';

import { productDraftStatusColorMap, productDraftStatusLabelMap } from '../constants';

type DraftProductDetailUrl = '/admin/product-checks/$id' | '/seller/product-checks/$id';

const ProductCell = ({
  product,
  url
}: {
  product: ProductConstructorPreview;
  url: DraftProductDetailUrl;
}) => {
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
        to={url}
      >
        {product.name}
      </Link>
    </div>
  );
};

interface UseDraftProductTableColumnsOptions {
  detailUrl: DraftProductDetailUrl;
}

export const useDraftProductTableColumns = ({
  detailUrl
}: UseDraftProductTableColumnsOptions): ColumnDef<ProductConstructorPreview>[] => {
  const { t } = useLingui();

  return [
    {
      id: 'search',
      accessorKey: 'name',
      header: t`Product`,
      cell: ({ row }) => {
        const product = row.original;

        return <ProductCell url={detailUrl} product={product} />;
      }
    },
    {
      id: 'sku',
      accessorKey: 'sku',
      header: 'SKU',
      cell: ({ row }) => <span className='font-mono text-xs'>{row.original.sku}</span>
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
      }
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: t`Status`,
      cell: ({ row }) => (
        <Badge
          style={{
            color: productDraftStatusColorMap[row.original.status],
            backgroundColor: `${productDraftStatusColorMap[row.original.status]}20`
          }}
          className={cn('font-mono text-xs')}
        >
          {t(productDraftStatusLabelMap[row.original.status])}
        </Badge>
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
        return (
          <Link
            params={{
              id: String(row.original.id)
            }}
            aria-label={t`Product detail`}
            className={buttonVariants({ size: 'icon-sm', variant: 'outline' })}
            to={detailUrl}
          >
            <EyeIcon />
          </Link>
        );
      },
      enablePinning: true
    }
  ];
};
