import type { ColumnDef } from '@tanstack/react-table';

import { useLingui } from '@lingui/react/macro';
import { Link } from '@tanstack/react-router';
import { MessageSquareReplyIcon, PaperclipIcon } from 'lucide-react';
import { useState } from 'react';

import {
  productRequestStatusLabelMap,
  productRequestStatusOptions,
  productRequestStatusVariantMap
} from '@/modules/product-requests/constants';
import { formatLocaleDate } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';

import { ProductRequestAnswerDialog } from '../components/ProductRequestAnswerDialog';
import { ProductRequestItems } from '../components/ProductRequestItems';

export const useProductRequestTableColumns = (): ColumnDef<ProductRequest>[] => {
  const { t } = useLingui();

  return [
    {
      id: 'search',
      accessorKey: 'buyer',
      header: t`Client`,
      cell: ({ row }) => (
        <Link
          className='text-primary font-medium hover:underline'
          params={{ id: String(row.original.buyer.id) }}
          to='/admin/users/$id'
        >
          {row.original.buyer.full_name || row.original.buyer.phone_number}
        </Link>
      ),
      meta: {
        variant: 'text',
        label: t`Search by client or product`
      },
      enableColumnFilter: true
    },
    {
      accessorKey: 'items',
      header: t`Products`,
      cell: ({ row }) => <ProductRequestItems items={row.original.items} />
    },
    {
      accessorKey: 'comment',
      header: t`Comment`,
      cell: ({ row }) => (
        <span className='line-clamp-2 max-w-60 text-sm'>{row.original.comment || '-'}</span>
      )
    },
    {
      accessorKey: 'file',
      header: t`File`,
      cell: ({ row }) =>
        row.original.file ? (
          <a
            href={row.original.file}
            className='text-primary inline-flex items-center gap-1 text-sm hover:underline'
            rel='noreferrer'
            target='_blank'
          >
            <PaperclipIcon className='size-4' />
            {t`Open`}
          </a>
        ) : (
          '-'
        )
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: t`Status`,
      cell: ({ row }) => (
        <Badge variant={productRequestStatusVariantMap[row.original.status]}>
          {t(productRequestStatusLabelMap[row.original.status])}
        </Badge>
      ),
      meta: {
        variant: 'select',
        options: productRequestStatusOptions.map(({ value, label }) => ({
          label: t(label),
          value
        })),
        label: t`Status`
      },
      enableColumnFilter: true
    },
    {
      accessorKey: 'created_at',
      header: t`Date`,
      cell: ({ row }) => formatLocaleDate(row.original.created_at, 'PP HH:mm')
    },
    {
      id: 'actions',
      size: 32,
      cell: function Cell({ row }) {
        const [openDialog, setOpenDialog] = useState(false);

        return (
          <>
            <Button
              aria-label={t`Answer`}
              size='icon'
              variant='ghost'
              onClick={() => setOpenDialog(true)}
            >
              <MessageSquareReplyIcon />
            </Button>
            <ProductRequestAnswerDialog
              request={row.original}
              onOpenChange={setOpenDialog}
              open={openDialog}
            />
          </>
        );
      }
    }
  ];
};
