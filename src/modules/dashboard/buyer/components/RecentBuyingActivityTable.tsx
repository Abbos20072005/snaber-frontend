import { useLingui } from '@lingui/react/macro';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';

import { getBuyerRecentBuyingActivityQueryOptions } from '@/modules/dashboard/buyer';
import { generateSlugId } from '@/shared/constants';
import { formatDate, formatPrice } from '@/shared/lib/format';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';

export const RecentBuyingActivityTable = () => {
  const { t } = useLingui();
  const data = useSuspenseQuery(getBuyerRecentBuyingActivityQueryOptions()).data;

  return (
    <Card className='rounded-lg'>
      <CardHeader>
        <CardTitle>{t`Recent buying activity`}</CardTitle>
        <CardDescription>{t`Latest orders from your buyer account.`}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t`Product`}</TableHead>
              <TableHead>{t`Quantity`}</TableHead>
              <TableHead>{t`Amount`}</TableHead>
              <TableHead>{t`Date`}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((order) => (
              <TableRow key={`${order.id}-${order.date}`}>
                <TableCell className='font-medium'>
                  <Link
                    params={{
                      slug: generateSlugId(order.id, order.product || '')
                    }}
                    className='text-primary underline-offset-2 hover:underline'
                    to='/product/$slug'
                  >
                    {order.product || '-'}
                  </Link>
                </TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>{formatPrice(order.amount)}</TableCell>
                <TableCell>{formatDate(order.date)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
