import { useLingui } from '@lingui/react/macro';
import { useSuspenseQuery } from '@tanstack/react-query';

import { getSellerTopProductsQueryOptions } from '@/modules/dashboard/seller';
import { formatPrice } from '@/shared/lib/format';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Progress } from '@/shared/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';

export const SellerTopProductsTable = () => {
  const { t } = useLingui();
  const { data } = useSuspenseQuery(getSellerTopProductsQueryOptions()).data;

  return (
    <Card className='rounded-lg'>
      <CardHeader>
        <CardTitle>{t`Top products`}</CardTitle>
        <CardDescription>{t`Product performance ranked by confirmed order value.`}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t`Product`}</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>{t`Orders`}</TableHead>
              <TableHead>{t`Revenue`}</TableHead>
              <TableHead>{t`Stock health`}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((product) => (
              <TableRow key={product.product_id}>
                <TableCell className='font-medium'>{product.product}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>{product.orders}</TableCell>
                <TableCell>{formatPrice(product.revenue)}</TableCell>
                <TableCell>
                  <div className='flex min-w-36 items-center gap-3'>
                    <Progress className='flex-1' value={product.stock_health} />
                    <span className='text-muted-foreground w-8 text-right text-xs'>
                      {product.stock_health}%
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
