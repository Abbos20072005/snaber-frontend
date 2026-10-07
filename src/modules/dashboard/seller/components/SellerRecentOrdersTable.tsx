import { useLingui } from '@lingui/react/macro';
import { useSuspenseQuery } from '@tanstack/react-query';

import { getSellerRecentOrdersQueryOptions } from '@/modules/dashboard/seller';
import { orderStatusLabelMap } from '@/modules/order';
import { formatPrice } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';

export const SellerRecentOrdersTable = () => {
  const { t } = useLingui();
  const { data } = useSuspenseQuery(getSellerRecentOrdersQueryOptions()).data;

  return (
    <Card className='rounded-lg'>
      <CardHeader>
        <CardTitle>{t`Recent orders`}</CardTitle>
        <CardDescription>{t`Recent buyer activity`}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t`Buyer`}</TableHead>
              <TableHead>{t`Order`}</TableHead>
              <TableHead>{t`Amount`}</TableHead>
              <TableHead>{t`Status`}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((order) => (
              <TableRow key={order.order}>
                <TableCell className='font-medium'>{order.buyer}</TableCell>
                <TableCell>{order.order}</TableCell>
                <TableCell>{formatPrice(order.amount)}</TableCell>
                <TableCell>
                  <Badge variant='secondary'>{t(orderStatusLabelMap[order.status])}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
