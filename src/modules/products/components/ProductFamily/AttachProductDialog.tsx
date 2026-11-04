import { useLingui } from '@lingui/react/macro';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

import { patchProduct } from '@/shared/api';
import { useDebouncedValue } from '@/shared/hooks/useDeboucedValue';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';

import { getProductsQueryOptions, PRODUCT_QUERY_KEYS } from '../../options';
import { getVariantErrorMessage } from './constants';

interface Props {
  family: ProductFamily;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Puts products that already exist in the catalog into the family.
export const AttachProductDialog = ({ open, onOpenChange, family }: Props) => {
  const { t } = useLingui();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);

  const productsQuery = useQuery({
    ...getProductsQueryOptions({
      params: { category: family.category, page_size: 20, search: debouncedSearch || undefined }
    }),
    enabled: open
  });
  const products = (productsQuery.data?.data.results ?? []).filter(
    (product) => product.family_id === null
  );

  const attachMutation = useMutation({
    mutationFn: (id: number) => patchProduct({ id, data: { family: family.id } }),
    onSuccess: () => toast.success(t`Successfully updated.`),
    onError: (error) => toast.error(getVariantErrorMessage(error)),
    meta: {
      invalidatesQuery: [...PRODUCT_QUERY_KEYS.base()],
      withoutToastOnError: true
    }
  });

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>{t`Add existing product`}</DialogTitle>
          <DialogDescription>
            {t`Products of the same category that are not in a family yet.`}
          </DialogDescription>
        </DialogHeader>
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t`Search by name or code`}
        />
        <div className='max-h-80 space-y-1 overflow-y-auto'>
          {products.map((product) => (
            <div
              key={product.id}
              className='hover:bg-muted flex items-center justify-between gap-3 rounded-md p-2'
            >
              <div className='min-w-0'>
                <p className='truncate text-sm font-medium'>{product.name}</p>
                <p className='text-muted-foreground font-mono text-xs'>{product.sku}</p>
              </div>
              <Button
                size='sm'
                type='button'
                variant='outline'
                loading={attachMutation.isPending && attachMutation.variables === product.id}
                onClick={() => attachMutation.mutate(product.id)}
              >
                {t`Add`}
              </Button>
            </div>
          ))}
          {!productsQuery.isPending && products.length === 0 && (
            <p className='text-muted-foreground py-6 text-center text-sm'>{t`No products found.`}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
