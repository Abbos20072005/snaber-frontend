import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { patchAttributeValue, postAttributeValue } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';

import type { AttributeValueFormSchema } from './AttributeValueForm';

import { ATTRIBUTES_QUERY_KEYS } from '../options';
import { AttributeValueForm } from './AttributeValueForm';

interface AttributeValueDialogProps {
  editValues?: AttributeValue;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AttributeValueDialog = ({
  editValues,
  open,
  onOpenChange
}: AttributeValueDialogProps) => {
  const { t } = useLingui();
  const isEdit = !!editValues;

  const createMutation = useMutation({
    mutationFn: postAttributeValue,
    onSuccess: () => {
      onOpenChange(false);
      toast.success(t`Successfully created.`);
    },
    onError: () => toast.error(t`Failed to create value.`),
    meta: {
      invalidatesQuery: ATTRIBUTES_QUERY_KEYS.values(),
      withoutToastOnError: true
    }
  });

  const updateMutation = useMutation({
    mutationFn: patchAttributeValue,
    onSuccess: () => {
      onOpenChange(false);
      toast.success(t`Successfully updated.`);
    },
    onError: () => toast.error(t`Failed to update value.`),
    meta: {
      invalidatesQuery: ATTRIBUTES_QUERY_KEYS.values(),
      withoutToastOnError: true
    }
  });

  const onSubmit = (values: AttributeValueFormSchema) => {
    const data: AttributeValueDto = {
      attribute: Number(values.attribute?.value),
      image: values.image[0],
      value_en: values.value_en,
      value_ru: values.value_ru,
      value_uz: values.value_uz
    };

    if (isEdit) {
      updateMutation.mutate({ data, id: editValues.id });
      return;
    }

    createMutation.mutate({ data });
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{isEdit ? t`Update value` : t`Create value`}</DialogTitle>
        </DialogHeader>
        <AttributeValueForm defaultValues={editValues} onSubmit={onSubmit} />
        <Button
          className='ml-auto w-fit'
          type='submit'
          form='attribute-value-form'
          loading={createMutation.isPending || updateMutation.isPending}
        >
          {t`Save changes`}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
