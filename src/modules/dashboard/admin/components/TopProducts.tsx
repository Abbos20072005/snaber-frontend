import { useLingui } from '@lingui/react/macro';
import { useSuspenseQuery } from '@tanstack/react-query';

import { getAdminTopProductsQueryOptions } from '@/modules/dashboard/admin';
import { formatPrice } from '@/shared/lib/format';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';

export const TopProducts = () => {
  const { t } = useLingui();

  const { data } = useSuspenseQuery(getAdminTopProductsQueryOptions()).data;

  return (
    <Card className='rounded-lg'>
      <CardHeader>
        <CardTitle>{t`Top products`}</CardTitle>
        <CardDescription>{t`Ranked by number of orders.`}</CardDescription>
      </CardHeader>
      <CardContent className='h-75 overflow-y-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t`Product`}</TableHead>
              <TableHead>{t`Orders`}</TableHead>
              <TableHead>{t`Revenue`}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((product, index) => (
              <TableRow key={index}>
                <TableCell className='font-medium'>{product.product_name}</TableCell>
                <TableCell>{product.orders_count}</TableCell>
                <TableCell>{formatPrice(product.orders_total)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
