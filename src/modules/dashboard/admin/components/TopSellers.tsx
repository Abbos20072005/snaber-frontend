import { useLingui } from '@lingui/react/macro';
import { useSuspenseQuery } from '@tanstack/react-query';

import { getAdminTopCompaniesQueryOptions } from '@/modules/dashboard/admin';
import { formatPrice } from '@/shared/lib/format';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';

export const TopSellers = () => {
  const { t } = useLingui();

  const { data } = useSuspenseQuery(getAdminTopCompaniesQueryOptions()).data;

  return (
    <Card className='rounded-lg'>
      <CardHeader>
        <CardTitle>{t`Top seller performance`}</CardTitle>
        <CardDescription>{t`Ranked by orders and quality score.`}</CardDescription>
      </CardHeader>
      <CardContent className='h-75 overflow-y-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t`Company`}</TableHead>
              <TableHead>{t`Orders`}</TableHead>
              <TableHead>{t`Revenue`}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((seller, index) => (
              <TableRow key={index}>
                <TableCell className='font-medium'>{seller.company_name}</TableCell>
                <TableCell>{seller.orders_count}</TableCell>
                <TableCell>{formatPrice(seller.orders_total)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
