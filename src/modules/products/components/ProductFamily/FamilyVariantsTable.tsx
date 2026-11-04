import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { SaveIcon, UnlinkIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { patchProduct } from '@/shared/api';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { DeleteAlertDialog } from '@/shared/ui/delete-alert-dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { NativeSelect, NativeSelectOption } from '@/shared/ui/native-select';
import { Switch } from '@/shared/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';

import { PRODUCT_QUERY_KEYS } from '../../options';
import { getVariantErrorMessage } from './constants';
import { NewAttributeValue } from './NewAttributeValue';

interface Props {
  family: ProductFamily;
  product: Product;
}

interface Draft {
  axes: Record<number, number | null>;
  is_active: boolean;
  price: string;
  sku: string;
  stock_quantity: string;
}

const toDraft = (variant: FamilyVariant, family: ProductFamily): Draft => ({
  axes: Object.fromEntries(
    family.axes.map((axis) => [
      axis.id,
      variant.options.find((option) => option.attribute === axis.id)?.id ?? null
    ])
  ),
  is_active: variant.is_active,
  price: String(Number(variant.price)),
  sku: variant.sku,
  stock_quantity: String(variant.stock_quantity)
});

// Spreadsheet-like editor: change the code, options, price and stock of every variant in place,
// then save the row.
export const FamilyVariantsTable = ({ family, product }: Props) => {
  const { t } = useLingui();
  const [edits, setEdits] = useState<Record<number, Draft>>({});
  const [detachTarget, setDetachTarget] = useState<FamilyVariant | null>(null);

  const draftOf = (variant: FamilyVariant) => edits[variant.id] ?? toDraft(variant, family);

  const isDirty = (variant: FamilyVariant) =>
    variant.id in edits &&
    JSON.stringify(edits[variant.id]) !== JSON.stringify(toDraft(variant, family));

  const updateDraft = (variant: FamilyVariant, patch: Partial<Draft>) =>
    setEdits((current) => ({ ...current, [variant.id]: { ...draftOf(variant), ...patch } }));

  const meta = {
    invalidatesQuery: [...PRODUCT_QUERY_KEYS.base()],
    withoutToastOnError: true
  };

  const saveMutation = useMutation({
    mutationFn: ({ variant, draft }: { draft: Draft; variant: FamilyVariant }) => {
      // The axes are replaced, the other option values of the variant stay as they are.
      const axisValueIds = new Set(
        family.axes.flatMap((axis) => axis.values.map((value) => value.id))
      );
      const kept = variant.values.filter((id) => !axisValueIds.has(id));
      const chosen = Object.values(draft.axes).filter((id): id is number => id !== null);

      return patchProduct({
        id: variant.id,
        data: {
          attribute_values: [...kept, ...chosen],
          is_active: draft.is_active,
          price: Number(draft.price),
          sku: draft.sku,
          stock_quantity: Number(draft.stock_quantity)
        }
      });
    },
    onSuccess: (_data, { variant }) => {
      setEdits((current) =>
        Object.fromEntries(Object.entries(current).filter(([id]) => Number(id) !== variant.id))
      );
      toast.success(t`Successfully updated.`);
    },
    onError: (error) => toast.error(getVariantErrorMessage(error)),
    meta
  });

  const detachMutation = useMutation({
    mutationFn: (variant: FamilyVariant) =>
      patchProduct({ id: variant.id, data: { family: null } }),
    onSuccess: () => toast.success(t`Successfully updated.`),
    onError: (error) => toast.error(getVariantErrorMessage(error)),
    onSettled: () => setDetachTarget(null),
    meta
  });

  const savingId = saveMutation.isPending ? saveMutation.variables.variant.id : undefined;

  return (
    <div className='space-y-3'>
      <div className='rounded-lg border'>
        <Table className='min-w-[44rem]'>
          <TableHeader>
            <TableRow className='bg-muted/50'>
              <TableHead>{t`Product`}</TableHead>
              {family.axes.map((axis) => (
                <TableHead key={axis.id} className='min-w-24'>
                  {axis.name}
                </TableHead>
              ))}
              <TableHead className='w-32'>{t`Code`}</TableHead>
              <TableHead className='w-28'>{t`Price`}</TableHead>
              <TableHead className='w-20'>{t`In stock`}</TableHead>
              <TableHead className='w-14'>{t`Active`}</TableHead>
              <TableHead className='w-20' />
            </TableRow>
          </TableHeader>
          <TableBody>
            {family.variants.map((variant) => {
              const draft = draftOf(variant);
              const isCurrent = variant.id === product.id;

              return (
                <TableRow key={variant.id} className={cn(isCurrent && 'bg-yellow-50')}>
                  <TableCell className='max-w-32 whitespace-normal'>
                    <Link
                      className='line-clamp-2 text-sm font-medium hover:underline'
                      params={{ id: String(variant.id) }}
                      to='/admin/products/$id'
                    >
                      {variant.name}
                    </Link>
                    {isCurrent && (
                      <Badge className='mt-1' variant='secondary'>
                        {t`Current`}
                      </Badge>
                    )}
                  </TableCell>
                  {family.axes.map((axis) => (
                    <TableCell key={axis.id}>
                      <NativeSelect
                        size='sm'
                        value={draft.axes[axis.id] ?? ''}
                        onChange={(event) =>
                          updateDraft(variant, {
                            axes: {
                              ...draft.axes,
                              [axis.id]: event.target.value ? Number(event.target.value) : null
                            }
                          })
                        }
                      >
                        <NativeSelectOption value=''>—</NativeSelectOption>
                        {axis.values.map((value) => (
                          <NativeSelectOption key={value.id} value={value.id}>
                            {value.value}
                          </NativeSelectOption>
                        ))}
                      </NativeSelect>
                    </TableCell>
                  ))}
                  <TableCell>
                    <Input
                      className='h-8'
                      value={draft.sku}
                      onChange={(event) => updateDraft(variant, { sku: event.target.value })}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      className='h-8'
                      min={0}
                      type='number'
                      value={draft.price}
                      onChange={(event) => updateDraft(variant, { price: event.target.value })}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      className='h-8'
                      min={0}
                      type='number'
                      value={draft.stock_quantity}
                      onChange={(event) =>
                        updateDraft(variant, { stock_quantity: event.target.value })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={draft.is_active}
                      onCheckedChange={(checked) => updateDraft(variant, { is_active: checked })}
                    />
                  </TableCell>
                  <TableCell>
                    <div className='flex justify-end gap-1'>
                      <Button
                        aria-label={t`Save changes`}
                        disabled={!isDirty(variant)}
                        size='icon-sm'
                        type='button'
                        variant='outline'
                        loading={savingId === variant.id}
                        onClick={() => saveMutation.mutate({ variant, draft })}
                      >
                        <SaveIcon />
                      </Button>
                      <Button
                        aria-label={t`Remove from variants`}
                        disabled={family.variants.length < 2}
                        size='icon-sm'
                        type='button'
                        variant='ghost'
                        onClick={() => setDetachTarget(variant)}
                      >
                        <UnlinkIcon />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className='grid gap-3 sm:grid-cols-2'>
        {family.axes.map((axis) => {
          const axisName = axis.name;

          return (
            <div key={axis.id} className='grid gap-1.5'>
              <Label>{t`New option for ${axisName}`}</Label>
              <NewAttributeValue attributeId={axis.id} />
            </div>
          );
        })}
      </div>

      <DeleteAlertDialog
        itemName={detachTarget?.name}
        title={t`Remove from variants`}
        description={t`The product stays in the catalog as a separate product.`}
        isLoading={detachMutation.isPending}
        onDelete={() => detachTarget && detachMutation.mutate(detachTarget)}
        onOpenChange={(open) => !open && setDetachTarget(null)}
        open={!!detachTarget}
      />
    </div>
  );
};
