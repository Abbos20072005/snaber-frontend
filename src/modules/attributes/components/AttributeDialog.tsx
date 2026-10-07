import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { patchAttribute, postAttribute } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';

import type { AttributeFormSchema } from './AttributeForm';

import { ATTRIBUTES_QUERY_KEYS } from '../options';
import { AttributeForm } from './AttributeForm';

interface AttributeDialogProps {
  defaultValues?: Partial<Attribute>;
  editValues?: Attribute;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AttributeDialog = ({
  defaultValues,
  editValues,
  open,
  onOpenChange
}: AttributeDialogProps) => {
  const { t } = useLingui();
  const isEdit = !!editValues;

  const createMutation = useMutation({
    mutationFn: postAttribute,
    onSuccess: () => {
      onOpenChange(false);
      toast.success(t`Successfully created.`);
    },
    onError: () => toast.error(t`Failed to create attribute.`),
    meta: {
      invalidatesQuery: ATTRIBUTES_QUERY_KEYS.all(),
      withoutToastOnError: true
    }
  });

  const updateMutation = useMutation({
    mutationFn: patchAttribute,
    onSuccess: () => {
      onOpenChange(false);
      toast.success(t`Successfully updated.`);
    },
    onError: () => toast.error(t`Failed to update attribute.`),
    meta: {
      invalidatesQuery: ATTRIBUTES_QUERY_KEYS.all(),
      withoutToastOnError: true
    }
  });

  const onSubmit = (values: AttributeFormSchema) => {
    const data = {
      attribute_type: values.attribute_type,
      category: Number(values.category?.value),
      is_filterable: values.is_filterable,
      name_uz: values.name_uz,
      name_ru: values.name_ru,
      name_en: values.name_en
    };

    if (isEdit) {
      updateMutation.mutate({ data, id: editValues.id });
      return;
    }

    createMutation.mutate({ data });
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>{isEdit ? t`Update attribute` : t`Create attribute`}</DialogTitle>
        </DialogHeader>
        <AttributeForm defaultValues={editValues ?? defaultValues} onSubmit={onSubmit} />
        <Button
          className='ml-auto w-fit'
          type='submit'
          form='attribute-form'
          loading={createMutation.isPending || updateMutation.isPending}
        >
          {t`Save changes`}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
