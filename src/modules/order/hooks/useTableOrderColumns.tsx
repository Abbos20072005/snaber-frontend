import type { ColumnDef } from '@tanstack/react-table';

import { useLingui } from '@lingui/react/macro';

import {
  orderStatusColorMap,
  orderStatusLabelMap,
  orderTypeColorMap,
  orderTypeLabelMap
} from '@/modules/order';
import { formatLocaleDate, formatPrice } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';

export const useTableOrderColumns = (): ColumnDef<Order>[] => {
  const { t } = useLingui();

  return [
    {
      accessorKey: 'id',
      header: t`Order`,
      cell: ({ row }) => <span className='font-medium'>#{row.original.id}</span>
    },
    {
      id: 'price',
      header: t`Price`,
      cell: ({ row }) => {
        const price = row.original.total_price;

        if (!price) return <Badge variant='outline'>{t`On request`}</Badge>;

        return formatPrice(price);
      }
    },
    {
      header: t`Type`,
      enableColumnFilter: true,
      accessorKey: 'order_type',
      cell: ({ row }) => {
        const value = row.original.order_type;
        const color = orderTypeColorMap[value];

        return (
          <Badge
            style={{
              color,
              backgroundColor: `${color}20`
            }}
          >
            {t(orderTypeLabelMap[value])}
          </Badge>
        );
      }
    },
    {
      accessorKey: 'status',
      header: t`Status`,
      enableColumnFilter: true,
      cell: ({ row }) => {
        const value = row.original.status;
        const color = orderStatusColorMap[value];

        return (
          <Badge
            style={{
              color,
              backgroundColor: `${color}20`
            }}
            className='capitalize'
          >
            {t(orderStatusLabelMap[value])}
          </Badge>
        );
      }
    },
    {
      accessorKey: 'created_at',
      header: t`Created`,
      cell: ({ row }) => formatLocaleDate(row.original.created_at, 'PP HH:mm')
    }
  ];
};
