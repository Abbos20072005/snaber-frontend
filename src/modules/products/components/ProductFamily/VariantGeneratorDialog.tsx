import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { postFamilyVariants } from '@/shared/api';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';

import { PRODUCT_QUERY_KEYS } from '../../options';
import { buildCombinations, getVariantErrorMessage, toSkuPart } from './constants';
import { NewAttributeValue } from './NewAttributeValue';

interface Props {
  family: ProductFamily;
  open: boolean;
  product: Product;
  onOpenChange: (open: boolean) => void;
}

interface RowOverride {
  price?: string;
  sku?: string;
  stock_quantity?: string;
}

// Picks values for every option and creates all missing combinations at once; the new variants
// are copies of the current product with their own code, price and stock.
export const VariantGeneratorDialog = ({ open, onOpenChange, product, family }: Props) => {
  const { t } = useLingui();
  const [selected, setSelected] = useState<Record<number, number[]>>({});
  const [overrides, setOverrides] = useState<Record<string, RowOverride>>({});

  const valueLabels = useMemo(
    () =>
      new Map(family.axes.flatMap((axis) => axis.values.map((value) => [value.id, value.value]))),
    [family.axes]
  );

  const activeAxes = family.axes.filter((axis) => (selected[axis.id] ?? []).length > 0);

  // Combinations that already exist are left out, the server rejects duplicates anyway.
  const existing = useMemo(
    () =>
      new Set(
        family.variants.map((variant) =>
          activeAxes
            .map((axis) => variant.options.find((option) => option.attribute === axis.id)?.id)
            .join('-')
        )
      ),
    [family.variants, activeAxes]
  );

  const rows = useMemo(
    () =>
      buildCombinations(activeAxes.map((axis) => selected[axis.id]))
        .filter((combination) => activeAxes.length > 0 && !existing.has(combination.join('-')))
        .map((combination) => {
          const key = combination.join('-');
          const suffix = combination.map((id) => toSkuPart(valueLabels.get(id) ?? '')).join('-');

          return {
            key,
            values: combination,
            labels: combination.map((id) => valueLabels.get(id)),
            sku: overrides[key]?.sku ?? [product.sku, suffix].filter(Boolean).join('-'),
            price: overrides[key]?.price ?? String(Number(product.price)),
            stock_quantity: overrides[key]?.stock_quantity ?? '0'
          };
        }),
    [activeAxes, selected, existing, overrides, valueLabels, product.sku, product.price]
  );

  const createVariantsMutation = useMutation({
    mutationFn: () =>
      postFamilyVariants({
        id: family.id,
        data: {
          base_product: product.id,
          items: rows.map((row) => ({
            attribute_values: row.values,
            price: Number(row.price),
            sku: row.sku,
            stock_quantity: Number(row.stock_quantity)
          }))
        }
      }),
    onSuccess: () => {
      onOpenChange(false);
      toast.success(t`Successfully created.`);
    },
    onError: (error) => toast.error(getVariantErrorMessage(error)),
    meta: {
      invalidatesQuery: [...PRODUCT_QUERY_KEYS.base()],
      withoutToastOnError: true
    }
  });

  const toggleValue = (axisId: number, valueId: number) =>
    setSelected((current) => {
      const values = current[axisId] ?? [];
      return {
        ...current,
        [axisId]: values.includes(valueId)
          ? values.filter((id) => id !== valueId)
          : [...values, valueId]
      };
    });

  const setOverride = (key: string, patch: RowOverride) =>
    setOverrides((current) => ({ ...current, [key]: { ...current[key], ...patch } }));

  const hasInvalidRow = rows.some((row) => !row.sku.trim());

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className='max-h-[90dvh] overflow-y-auto sm:max-w-3xl'>
        <DialogHeader>
          <DialogTitle>{t`Add variants`}</DialogTitle>
          <DialogDescription>
            {t`Pick the options of the new variants. Every combination becomes a product, copied from the current one.`}
          </DialogDescription>
        </DialogHeader>

        <div className='grid gap-4'>
          {family.axes.map((axis) => (
            <div key={axis.id} className='grid gap-2'>
              <Label>{axis.name}</Label>
              <div className='flex flex-wrap gap-2'>
                {axis.values.map((value) => {
                  const isSelected = (selected[axis.id] ?? []).includes(value.id);

                  return (
                    <button
                      key={value.id}
                      type='button'
                      onClick={() => toggleValue(axis.id, value.id)}
                    >
                      <Badge
                        className={cn('cursor-pointer', isSelected || 'font-normal')}
                        variant={isSelected ? 'default' : 'outline'}
                      >
                        {value.value}
                      </Badge>
                    </button>
                  );
                })}
              </div>
              <NewAttributeValue
                attributeId={axis.id}
                onCreated={(value) => toggleValue(axis.id, value.id)}
              />
            </div>
          ))}
        </div>

        {rows.length > 0 ? (
          <div className='rounded-lg border'>
            <Table>
              <TableHeader>
                <TableRow>
                  {activeAxes.map((axis) => (
                    <TableHead key={axis.id}>{axis.name}</TableHead>
                  ))}
                  <TableHead>{t`Code`}</TableHead>
                  <TableHead className='w-32'>{t`Price`}</TableHead>
                  <TableHead className='w-24'>{t`In stock`}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.key}>
                    {row.labels.map((label, index) => (
                      <TableCell key={activeAxes[index].id}>{label}</TableCell>
                    ))}
                    <TableCell>
                      <Input
                        className='h-8'
                        value={row.sku}
                        onChange={(event) => setOverride(row.key, { sku: event.target.value })}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        className='h-8'
                        min={0}
                        type='number'
                        value={row.price}
                        onChange={(event) => setOverride(row.key, { price: event.target.value })}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        className='h-8'
                        min={0}
                        type='number'
                        value={row.stock_quantity}
                        onChange={(event) =>
                          setOverride(row.key, { stock_quantity: event.target.value })
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className='text-muted-foreground text-sm'>
            {activeAxes.length > 0
              ? t`All of these combinations already exist.`
              : t`Pick at least one option value.`}
          </p>
        )}

        <DialogFooter>
          <Button
            disabled={rows.length === 0 || hasInvalidRow}
            type='button'
            loading={createVariantsMutation.isPending}
            onClick={() => createVariantsMutation.mutate()}
          >
            {t`Create`} {rows.length > 0 && `(${rows.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
