import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { patchFaq, postFaq } from '@/shared/api/requests/faq';
import { Button } from '@/shared/ui/button.tsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';

import type { FaqFormSchema } from './FaqForm';

import { FAQ_QUERY_KEYS } from '../options';
import { FaqForm } from './FaqForm';

interface Props {
  defaultValues?: Partial<Faq>;
  editValues?: Faq;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FaqDialog = ({ open, onOpenChange, editValues, defaultValues }: Props) => {
  const { t } = useLingui();

  const isEdit = !!editValues;

  const faqPostMutation = useMutation({
    mutationFn: postFaq,
    onSuccess: () => {
      onOpenChange(false);
      toast.success(t`Successfully created.`);
    },
    onError: () => {
      toast.error(t`Failed to create FAQ.`);
    },
    meta: {
      invalidatesQuery: FAQ_QUERY_KEYS.all(),
      withoutToastOnError: true
    }
  });

  const faqPatchMutation = useMutation({
    mutationFn: patchFaq,
    onSuccess: () => {
      onOpenChange(false);
      toast.success(t`Successfully updated.`);
    },
    onError: () => {
      toast.error(t`Failed to update FAQ.`);
    },
    meta: {
      invalidatesQuery: FAQ_QUERY_KEYS.all(),
      withoutToastOnError: true
    }
  });

  const onSubmit = (values: FaqFormSchema) => {
    const data = {
      ...values
    };

    if (isEdit)
      faqPatchMutation.mutate({
        data,
        id: editValues.id
      });
    else
      faqPostMutation.mutate({
        data
      });
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>{isEdit ? t`Update FAQ` : t`Create FAQ`}</DialogTitle>
        </DialogHeader>
        <FaqForm defaultValues={editValues ?? defaultValues} onSubmit={onSubmit} />
        <Button
          className='ml-auto w-fit'
          type='submit'
          form='faq-form'
          loading={faqPatchMutation.isPending || faqPostMutation.isPending}
        >
          {t`Save changes`}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
