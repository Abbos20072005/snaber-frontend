import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { LayersIcon, PencilIcon, PlusIcon, SearchIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { deleteFamily } from '@/shared/api';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/ui/card';
import { DeleteAlertDialog } from '@/shared/ui/delete-alert-dialog';

import { PRODUCT_QUERY_KEYS } from '../../options';
import { AttachProductDialog } from './AttachProductDialog';
import { getVariantErrorMessage } from './constants';
import { FamilyDialog } from './FamilyDialog';
import { FamilyVariantsTable } from './FamilyVariantsTable';
import { VariantGeneratorDialog } from './VariantGeneratorDialog';

interface Props {
  product: Product;
}

type DialogName = 'attach' | 'delete' | 'family' | 'generator' | null;

// Variants of a product (the same kind of product in different sizes), managed on the product page.
export const ProductFamilySection = ({ product }: Props) => {
  const { t } = useLingui();
  const [dialog, setDialog] = useState<DialogName>(null);
  const family = product.family;

  const deleteFamilyMutation = useMutation({
    mutationFn: () => deleteFamily({ id: family!.id }),
    onSuccess: () => toast.success(t`Successfully deleted.`),
    onError: (error) => toast.error(getVariantErrorMessage(error)),
    onSettled: () => setDialog(null),
    meta: {
      invalidatesQuery: [...PRODUCT_QUERY_KEYS.base()],
      withoutToastOnError: true
    }
  });

  const closeDialog = (open: boolean) => !open && setDialog(null);

  if (!family)
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <LayersIcon className='size-5' />
            {t`Variants`}
          </CardTitle>
          <CardDescription>
            {t`Is this product sold in several sizes or types? Group them so shoppers see all variants in one table.`}
          </CardDescription>
          <CardAction>
            <Button type='button' variant='outline' onClick={() => setDialog('family')}>
              <PlusIcon />
              {t`Create variants`}
            </Button>
          </CardAction>
        </CardHeader>
        {dialog === 'family' && <FamilyDialog onOpenChange={closeDialog} open product={product} />}
      </Card>
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <LayersIcon className='size-5' />
          {t`Variants`} ({family.variants.length})
        </CardTitle>
        <CardDescription className='flex flex-wrap items-center gap-2'>
          <span className='text-foreground font-medium'>{family.name}</span>
          {family.axes.map((axis) => (
            <Badge key={axis.id} variant='outline'>
              {axis.name}
            </Badge>
          ))}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='mb-3 flex flex-wrap gap-2'>
          <Button size='sm' type='button' variant='outline' onClick={() => setDialog('generator')}>
            <PlusIcon />
            {t`Add variants`}
          </Button>
          <Button size='sm' type='button' variant='outline' onClick={() => setDialog('attach')}>
            <SearchIcon />
            {t`Add existing product`}
          </Button>
          <Button size='sm' type='button' variant='outline' onClick={() => setDialog('family')}>
            <PencilIcon />
            {t`Edit`}
          </Button>
          <Button size='sm' type='button' variant='destructive' onClick={() => setDialog('delete')}>
            <Trash2Icon />
            {t`Delete`}
          </Button>
        </div>
        <FamilyVariantsTable family={family} product={product} />
      </CardContent>

      {dialog === 'family' && (
        <FamilyDialog family={family} onOpenChange={closeDialog} open product={product} />
      )}
      {dialog === 'generator' && (
        <VariantGeneratorDialog family={family} onOpenChange={closeDialog} open product={product} />
      )}
      {dialog === 'attach' && (
        <AttachProductDialog family={family} onOpenChange={closeDialog} open />
      )}
      <DeleteAlertDialog
        itemName={family.name}
        title={t`Delete variants group`}
        description={t`The products stay in the catalog as separate products. Only the grouping is removed.`}
        isLoading={deleteFamilyMutation.isPending}
        onDelete={deleteFamilyMutation.mutate}
        onOpenChange={closeDialog}
        open={dialog === 'delete'}
      />
    </Card>
  );
};
