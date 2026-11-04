import { useLingui } from '@lingui/react/macro';
import { useSuspenseQuery } from '@tanstack/react-query';

import { getAdminAbandonedCartsQueryOptions } from '@/modules/dashboard/admin';
import { formatLocaleDate, formatPrice } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';

export const AbandonedCarts = () => {
  const { t } = useLingui();
  const { data } = useSuspenseQuery(getAdminAbandonedCartsQueryOptions()).data;
  const hours = data.after_hours;

  return (
    <Card className='rounded-lg'>
      <CardHeader>
        <CardTitle>{t`Abandoned carts`}</CardTitle>
        <CardDescription>{t`Items left in the cart for more than ${hours} hours.`}</CardDescription>
        <div className='flex gap-6 pt-2'>
          <div>
            <p className='text-2xl font-semibold'>{data.carts_count}</p>
            <p className='text-muted-foreground text-xs'>{t`Carts`}</p>
          </div>
          <div>
            <p className='text-2xl font-semibold'>
              {formatPrice(Math.round(Number(data.total_value)))}
            </p>
            <p className='text-muted-foreground text-xs'>{t`Potential revenue (so'm)`}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {data.top.length === 0 ? (
          <p className='text-muted-foreground py-6 text-center text-sm'>
            {t`No abandoned carts right now.`}
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t`Customer`}</TableHead>
                <TableHead>{t`Items`}</TableHead>
                <TableHead>{t`Total`}</TableHead>
                <TableHead>{t`Last activity`}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.top.map((cart, index) => (
                <TableRow key={index}>
                  <TableCell className='font-medium'>
                    {cart.is_guest ? <Badge variant='secondary'>{t`Guest`}</Badge> : cart.customer}
                    {!cart.is_guest && cart.phone_number && cart.customer !== cart.phone_number && (
                      <span className='text-muted-foreground block text-xs'>
                        {cart.phone_number}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{cart.items_count}</TableCell>
                  <TableCell>{formatPrice(Math.round(Number(cart.total)))}</TableCell>
                  <TableCell>{formatLocaleDate(cart.last_activity, 'd MMM, HH:mm')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
