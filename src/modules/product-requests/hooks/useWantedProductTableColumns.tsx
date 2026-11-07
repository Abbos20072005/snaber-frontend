import type { ColumnDef } from '@tanstack/react-table';

import { useLingui } from '@lingui/react/macro';

import { formatLocaleDate } from '@/shared/lib/format';

export const useWantedProductTableColumns = (): ColumnDef<WantedProduct>[] => {
  const { t } = useLingui();

  return [
    {
      id: 'search',
      accessorKey: 'name',
      header: t`Product`,
      cell: ({ row }) => <span className='font-medium'>{row.original.name}</span>,
      meta: {
        variant: 'text',
        label: t`Search by product`
      },
      enableColumnFilter: true
    },
    {
      accessorKey: 'requests_count',
      header: t`Requests`
    },
    {
      accessorKey: 'total_quantity',
      header: t`Quantity`
    },
    {
      accessorKey: 'last_requested_at',
      header: t`Last request`,
      cell: ({ row }) => formatLocaleDate(row.original.last_requested_at, 'PP HH:mm')
    }
  ];
};
