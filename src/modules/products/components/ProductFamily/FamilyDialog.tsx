import { useLingui } from '@lingui/react/macro';
import { useMutation, useQuery } from '@tanstack/react-query';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { patchFamily, postAttribute, postFamily } from '@/shared/api';
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
import { useAppForm } from '@/shared/ui/form/hooks';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

import type { FamilySchema } from './constants';

import {
  getProductAttributesByCategoryQueryOptions,
  PRODUCT_ATTRIBUTE_QUERY_KEYS,
  PRODUCT_QUERY_KEYS
} from '../../options';
import { familySchema, getVariantErrorMessage } from './constants';

interface Props {
  family?: ProductFamily;
  open: boolean;
  product: Product;
  onOpenChange: (open: boolean) => void;
}

// Creates a family from the current product, or renames a family and changes its options.
export const FamilyDialog = ({ open, onOpenChange, product, family }: Props) => {
  const { t } = useLingui();
  const isEdit = !!family;
  const categoryId = family?.category ?? product.category.id;

  const [axes, setAxes] = useState<number[]>(family?.axes.map((axis) => axis.id) ?? []);
  const [newAxis, setNewAxis] = useState('');

  const attributesQuery = useQuery({
    ...getProductAttributesByCategoryQueryOptions({ params: { category: categoryId } }),
    enabled: open
  });
  const attributes = attributesQuery.data?.data ?? [];

  const createAxisMutation = useMutation({
    mutationFn: () =>
      postAttribute({
        data: {
          attribute_type: 'select',
          category: categoryId,
          is_filterable: true,
          name_en: newAxis.trim(),
          name_ru: newAxis.trim(),
          name_uz: newAxis.trim()
        }
      }),
    onSuccess: ({ data }) => {
      setAxes((current) => [...current, data.id]);
      setNewAxis('');
    },
    onError: () => toast.error(t`Failed to create the option.`),
    meta: {
      invalidatesQuery: [...PRODUCT_ATTRIBUTE_QUERY_KEYS.all()],
      withoutToastOnError: true
    }
  });

  const onSuccess = () => {
    onOpenChange(false);
    toast.success(isEdit ? t`Successfully updated.` : t`Successfully created.`);
  };

  const meta = {
    invalidatesQuery: [...PRODUCT_QUERY_KEYS.base()],
    withoutToastOnError: true
  };

  const createFamilyMutation = useMutation({
    mutationFn: (values: FamilySchema) =>
      postFamily({
        data: { ...values, axes, category: categoryId, products: [product.id] }
      }),
    onSuccess,
    onError: (error) => toast.error(getVariantErrorMessage(error)),
    meta
  });

  const updateFamilyMutation = useMutation({
    mutationFn: (values: FamilySchema) =>
      patchFamily({ id: family!.id, data: { ...values, axes } }),
    onSuccess,
    onError: (error) => toast.error(getVariantErrorMessage(error)),
    meta
  });

  const form = useAppForm({
    validators: { onChange: familySchema() },
    defaultValues: {
      name_en: family?.name_en ?? product.name_en,
      name_ru: family?.name_ru ?? product.name_ru,
      name_uz: family?.name_uz ?? product.name_uz
    } satisfies FamilySchema,
    onSubmit: ({ value }) => {
      if (isEdit) updateFamilyMutation.mutate(value);
      else createFamilyMutation.mutate(value);
    }
  });

  const toggleAxis = (id: number) =>
    setAxes((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );

  const onCreateAxis = () => {
    if (newAxis.trim()) createAxisMutation.mutate();
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>{isEdit ? t`Edit variants` : t`Create variants`}</DialogTitle>
          <DialogDescription>
            {t`Variants are products of the same kind that differ by options such as size. Each variant keeps its own code, price and stock.`}
          </DialogDescription>
        </DialogHeader>

        <form.AppForm>
          <form
            className='space-y-4'
            id='family-form'
            onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              void form.handleSubmit();
            }}
          >
            <form.AppField name='name_uz'>
              {(field) => (
                <field.Input
                  isRequired
                  label={`${t`Name`} (UZ)`}
                  placeholder={t`Name of the product group`}
                />
              )}
            </form.AppField>
            <form.AppField name='name_ru'>
              {(field) => <field.Input label={`${t`Name`} (RU)`} />}
            </form.AppField>
            <form.AppField name='name_en'>
              {(field) => <field.Input label={`${t`Name`} (EN)`} />}
            </form.AppField>
          </form>
        </form.AppForm>

        <div className='grid gap-2'>
          <Label>{t`Options that tell the variants apart`}</Label>
          <div className='flex flex-wrap gap-2'>
            {attributes.map((attribute) => {
              const isSelected = axes.includes(attribute.id);

              return (
                <button key={attribute.id} type='button' onClick={() => toggleAxis(attribute.id)}>
                  <Badge
                    className={cn('cursor-pointer', isSelected || 'font-normal')}
                    variant={isSelected ? 'default' : 'outline'}
                  >
                    {attribute.name}
                  </Badge>
                </button>
              );
            })}
          </div>
          <div className='flex gap-2'>
            <Input
              className='h-8'
              value={newAxis}
              onChange={(event) => setNewAxis(event.target.value)}
              onKeyDown={(event) => {
                if (event.key !== 'Enter') return;
                event.preventDefault();
                onCreateAxis();
              }}
              placeholder={t`New option name, e.g. Diameter`}
            />
            <Button
              aria-label={t`Add option`}
              disabled={!newAxis.trim()}
              size='icon-sm'
              type='button'
              variant='outline'
              loading={createAxisMutation.isPending}
              onClick={onCreateAxis}
            >
              <PlusIcon />
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button
            disabled={axes.length === 0}
            type='submit'
            form='family-form'
            loading={createFamilyMutation.isPending || updateFamilyMutation.isPending}
          >
            {isEdit ? t`Save changes` : t`Create variants`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
