import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { CATEGORY_QUERY_KEYS } from '@/modules/category';
import { patchCategory, postCategory } from '@/shared/api';
import { Button } from '@/shared/ui/button.tsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';

import type { CategoryFormSchema } from './CategoryForm';

import { CategoryForm } from './CategoryForm';

interface Props {
  defaultValues?: Partial<Category>;
  editValues?: Category;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CategoryDialog = ({ open, onOpenChange, editValues, defaultValues }: Props) => {
  const { t } = useLingui();

  const isEdit = !!editValues;

  const categoryPostMutation = useMutation({
    mutationFn: postCategory,
    onSuccess: () => {
      onOpenChange(false);
      toast.success(t`Successfully created.`);
    },
    onError: () => {
      toast.error(t`Failed to create category.`);
    },
    meta: {
      invalidatesQuery: [...CATEGORY_QUERY_KEYS.all()],
      withoutToastOnError: true
    }
  });

  const categoryPatchMutation = useMutation({
    mutationFn: patchCategory,
    onSuccess: () => {
      onOpenChange(false);
      toast.success(t`Successfully updated.`);
    },
    onError: () => {
      toast.error(t`Failed to update category.`);
    },
    meta: {
      invalidatesQuery: [...CATEGORY_QUERY_KEYS.all()],
      withoutToastOnError: true
    }
  });

  const onSubmit = (values: CategoryFormSchema) => {
    const data = {
      ...values,
      image: values.image[0],
      parent: values.parent?.value
    };

    if (isEdit)
      categoryPatchMutation.mutate({
        data,
        id: editValues.id
      });
    else
      categoryPostMutation.mutate({
        data
      });
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>{isEdit ? t`Update category` : t`Create category`}</DialogTitle>
        </DialogHeader>
        <CategoryForm defaultValues={editValues ?? defaultValues} onSubmit={onSubmit} />
        <Button
          className='ml-auto w-fit'
          type='submit'
          form='category-form'
          loading={categoryPatchMutation.isPending || categoryPostMutation.isPending}
        >
          {t`Save changes`}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
