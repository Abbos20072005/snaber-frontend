import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { ShoppingCartIcon } from 'lucide-react';
import { toast } from 'sonner';

import { PRODUCT_QUERY_KEYS } from '@/modules/products';
import { postCart } from '@/shared/api/requests/product/cart';
import { CURRENCY_SYMBOL } from '@/shared/constants';
import { formatPrice } from '@/shared/lib/format';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { NativeSelect } from '@/shared/ui/native-select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';

export interface QuickOrderRow {
  matches: ProductPreview[];
  name: string;
  productId: number | null;
  quantity: number;
}

interface Props {
  rows: QuickOrderRow[];
  onChange: (rows: QuickOrderRow[]) => void;
}

export const QuickOrderReview = ({ rows, onChange }: Props) => {
  const { t } = useLingui();
  const navigate = useNavigate();

  const selectedRows = rows.filter((row) => row.productId !== null);
  const notFoundCount = rows.filter((row) => row.productId === null && row.name.trim()).length;

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      const results = await Promise.allSettled(
        selectedRows.map((row) =>
          postCart({ data: { product: row.productId!, quantity: row.quantity } })
        )
      );
      return results.filter((result) => result.status === 'rejected').length;
    },
    onSuccess: (failedCount) => {
      if (failedCount > 0) {
        toast.error(t`${failedCount} products could not be added. Check the stock.`);
        return;
      }
      toast.success(t`Added to cart`);
      if (notFoundCount === 0) void navigate({ to: '/cart' });
    },
    meta: {
      invalidatesQuery: PRODUCT_QUERY_KEYS.getCartList()
    }
  });

  const updateRow = (index: number, patch: Partial<QuickOrderRow>) =>
    onChange(rows.map((row, rowIndex) => (rowIndex === index ? { ...row, ...patch } : row)));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t`Found products`}</CardTitle>
        <CardDescription>
          {t`Check every line, change the product or the quantity, then add them to the cart.`}
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t`Your list`}</TableHead>
              <TableHead>{t`Product`}</TableHead>
              <TableHead>{t`Quantity`}</TableHead>
              <TableHead className='text-right'>{t`Amount`}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => {
              const product = row.matches.find((item) => item.id === row.productId);

              return (
                <TableRow key={index}>
                  <TableCell className='font-medium whitespace-normal'>
                    {row.matches.length === 0 ? (
                      <Input
                        className='min-w-40'
                        value={row.name}
                        onChange={(event) => updateRow(index, { name: event.target.value })}
                        placeholder={t`Product name`}
                      />
                    ) : (
                      row.name
                    )}
                  </TableCell>
                  <TableCell>
                    <NativeSelect
                      className='w-full min-w-56'
                      value={row.productId ?? ''}
                      onChange={(event) =>
                        updateRow(index, {
                          productId: event.target.value ? +event.target.value : null
                        })
                      }
                    >
                      {row.matches.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                          {item.stock_quantity === 0 && ` (${t`Out of stock`})`}
                        </option>
                      ))}
                      <option value=''>
                        {row.matches.length === 0 ? t`Not found` : t`None of these`}
                      </option>
                    </NativeSelect>
                  </TableCell>
                  <TableCell>
                    <Input
                      className='w-24'
                      min={1}
                      type='number'
                      value={row.quantity}
                      onChange={(event) =>
                        updateRow(index, { quantity: Math.max(1, +event.target.value || 1) })
                      }
                    />
                    {product && row.quantity > product.stock_quantity && (
                      <p className='text-destructive mt-1 text-xs'>
                        {t`In stock`}: {product.stock_quantity}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className='text-right whitespace-nowrap'>
                    {product
                      ? `${formatPrice(+product.final_price * row.quantity)} ${t(CURRENCY_SYMBOL)}`
                      : '-'}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <p className='text-muted-foreground text-sm'>
            {notFoundCount > 0
              ? t`${notFoundCount} lines are not in the catalog. They will be sent as a request below.`
              : t`All lines were found.`}
          </p>
          <Button
            disabled={selectedRows.length === 0}
            loading={addToCartMutation.isPending}
            onClick={() => addToCartMutation.mutate()}
          >
            <ShoppingCartIcon />
            {t`Add to cart`} ({selectedRows.length})
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
