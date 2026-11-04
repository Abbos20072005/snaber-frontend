import { useLingui } from '@lingui/react/macro';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';

import { getAdminStockAlertsQueryOptions } from '@/modules/dashboard/admin';
import { formatPrice } from '@/shared/lib/format';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs';

type Tab = 'dead' | 'low' | 'out';

export const StockAlerts = () => {
  const { t } = useLingui();
  const [tab, setTab] = useState<Tab>('low');
  const { data } = useSuspenseQuery(getAdminStockAlertsQueryOptions()).data;

  const threshold = data.low_stock_threshold;
  const days = data.dead_stock_days;

  const rows: Record<Tab, AdminStockProduct[]> = {
    dead: data.dead_stock,
    low: data.low_stock,
    out: data.out_of_stock
  };
  const descriptions: Record<Tab, string> = {
    dead: t`In stock but not ordered for ${days} days.`,
    low: t`${threshold} or fewer left in stock.`,
    out: t`Active products with no stock left.`
  };
  const isDead = tab === 'dead';
  const deadValue = formatPrice(Math.round(Number(data.dead_stock_value)));

  return (
    <Card className='rounded-lg'>
      <CardHeader>
        <CardTitle>{t`Stock alerts`}</CardTitle>
        <CardDescription>{descriptions[tab]}</CardDescription>
        <Tabs className='pt-2' value={tab} onValueChange={(value) => setTab(value as Tab)}>
          <TabsList>
            <TabsTrigger value='low'>
              {t`Low stock`} ({data.low_stock_count})
            </TabsTrigger>
            <TabsTrigger value='out'>
              {t`Out of stock`} ({data.out_of_stock_count})
            </TabsTrigger>
            <TabsTrigger value='dead'>
              {t`Not selling`} ({data.dead_stock_count})
            </TabsTrigger>
          </TabsList>
        </Tabs>
        {isDead && data.dead_stock_count > 0 && (
          <p className='text-muted-foreground pt-1 text-sm'>
            {t`Money tied up in stock: ${deadValue} so'm`}
          </p>
        )}
      </CardHeader>
      <CardContent>
        {rows[tab].length === 0 ? (
          <p className='text-muted-foreground py-6 text-center text-sm'>{t`Nothing to show.`}</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t`Product`}</TableHead>
                <TableHead>{t`Code`}</TableHead>
                <TableHead>{t`In stock`}</TableHead>
                {isDead && <TableHead>{t`Stock value`}</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows[tab].map((product) => (
                <TableRow key={product.id}>
                  <TableCell className='max-w-64 truncate font-medium'>
                    <Link
                      className='hover:underline'
                      params={{ id: String(product.id) }}
                      to='/admin/products/$id'
                    >
                      {product.name}
                    </Link>
                  </TableCell>
                  <TableCell className='text-muted-foreground'>{product.sku || '—'}</TableCell>
                  <TableCell>{product.stock_quantity}</TableCell>
                  {isDead && (
                    <TableCell>
                      {formatPrice(Math.round(Number(product.stock_value ?? 0)))}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
