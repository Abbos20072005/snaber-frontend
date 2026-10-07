import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { patchUnitOfMeasure, postUnitOfMeasure } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';

import type { UnitOfMeasureSchema } from './UnitOfMeasureForm';

import { UNIT_OF_MEASURES_QUERY_KEYS } from '../options';
import { UnitOfMeasureForm } from './UnitOfMeasureForm';

interface Props {
  defaultValues?: Partial<UnitOfMeasure>;
  editValues?: UnitOfMeasure;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UnitDialog = ({ open, onOpenChange, editValues, defaultValues }: Props) => {
  const { t } = useLingui();
  const isEdit = !!editValues;

  const unitPostMutation = useMutation({
    mutationFn: postUnitOfMeasure,
    onSuccess: () => {
      onOpenChange(false);
      toast.success(t`Successfully created.`);
    },
    onError: () => {
      toast.error(t`Failed to create unit.`);
    },
    meta: {
      invalidatesQuery: UNIT_OF_MEASURES_QUERY_KEYS.base(),
      withoutToastOnError: true
    }
  });

  const unitPatchMutation = useMutation({
    mutationFn: patchUnitOfMeasure,
    onSuccess: () => {
      onOpenChange(false);
      toast.success(t`Successfully updated.`);
    },
    onError: () => {
      toast.error(t`Failed to update unit.`);
    },
    meta: {
      invalidatesQuery: UNIT_OF_MEASURES_QUERY_KEYS.base(),
      withoutToastOnError: true
    }
  });

  const onSubmit = (values: UnitOfMeasureSchema) => {
    if (isEdit)
      unitPatchMutation.mutate({
        data: values,
        id: editValues.id
      });
    else
      unitPostMutation.mutate({
        data: values
      });
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className='sm:max-w-xs'>
        <DialogHeader>
          <DialogTitle>{isEdit ? t`Update unit` : t`Create unit`}</DialogTitle>
        </DialogHeader>
        <UnitOfMeasureForm defaultValues={editValues ?? defaultValues} onSubmit={onSubmit} />
        <Button
          className='ml-auto w-fit'
          type='submit'
          form='unit-form'
          loading={unitPatchMutation.isPending || unitPostMutation.isPending}
        >
          {t`Save changes`}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
