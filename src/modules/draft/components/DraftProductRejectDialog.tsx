import { t } from '@lingui/core/macro';
import { useLingui } from '@lingui/react/macro';
import z from 'zod';

import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/shared/ui/dialog';
import { FieldGroup } from '@/shared/ui/field';
import { useAppForm } from '@/shared/ui/form/hooks';

const draftProductRejectFormSchema = () =>
  z.object({
    moderator_comment: z.string().min(1, t`Message is required`)
  });

type DraftProductRejectFormSchema = z.infer<ReturnType<typeof draftProductRejectFormSchema>>;

interface Props {
  isLoading: boolean;
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onSubmit: (value: DraftProductRejectFormSchema) => void;
}

export const DraftProductRejectDialog = ({ isLoading, onOpenChange, onSubmit, open }: Props) => {
  const { t } = useLingui();
  const formId = 'draft-product-reject-form';

  const form = useAppForm({
    validators: {
      onChange: draftProductRejectFormSchema()
    },
    defaultValues: {
      moderator_comment: ''
    } satisfies DraftProductRejectFormSchema as DraftProductRejectFormSchema,
    onSubmit: ({ value }) => onSubmit(value)
  });

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className='sm:max-w-sm'>
        <DialogHeader>
          <DialogTitle>{t`Reject draft product`}</DialogTitle>
          <DialogDescription>{t`Write the message that will be shown to the seller.`}</DialogDescription>
        </DialogHeader>
        <form.AppForm>
          <form
            id={formId}
            onSubmit={(event) => {
              event.stopPropagation();
              event.preventDefault();
              void form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.AppField name='moderator_comment'>
                {(field) => (
                  <field.Textarea
                    isRequired
                    label={t`Message`}
                    placeholder={t`Enter message`}
                  />
                )}
              </form.AppField>
            </FieldGroup>
          </form>
        </form.AppForm>
        <DialogFooter>
          <DialogClose render={<Button variant='outline'>{t`Cancel`}</Button>} />
          <Button type='submit' variant='destructive' form={formId} loading={isLoading}>
            {t`Reject`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
