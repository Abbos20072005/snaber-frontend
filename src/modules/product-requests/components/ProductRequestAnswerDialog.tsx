import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  PRODUCT_REQUESTS_QUERY_KEYS,
  productRequestStatusOptions
} from '@/modules/product-requests';
import { patchProductRequest } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { useAppForm } from '@/shared/ui/form/hooks';
import { SelectItem } from '@/shared/ui/select';

import { ProductRequestItems } from './ProductRequestItems';

interface Props {
  open: boolean;
  request: ProductRequest;
  onOpenChange: (open: boolean) => void;
}

export const ProductRequestAnswerDialog = ({ open, onOpenChange, request }: Props) => {
  const { t } = useLingui();

  const patchMutation = useMutation({
    mutationFn: patchProductRequest,
    onSuccess: () => {
      onOpenChange(false);
      toast.success(t`Successfully updated.`);
    },
    onError: () => toast.error(t`Failed to update the request.`),
    meta: {
      invalidatesQuery: [...PRODUCT_REQUESTS_QUERY_KEYS.base()],
      withoutToastOnError: true
    }
  });

  const form = useAppForm({
    defaultValues: {
      status: request.status,
      answer: request.answer
    },
    onSubmit: ({ value }) => patchMutation.mutate({ id: request.id, data: value })
  });

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t`Request`} #{request.id}
          </DialogTitle>
        </DialogHeader>
        <ProductRequestItems items={request.items} />
        {request.comment && <p className='text-muted-foreground text-sm'>{request.comment}</p>}
        <form.AppForm>
          <form
            className='grid gap-4'
            id='product-request-form'
            onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              void form.handleSubmit();
            }}
          >
            <form.AppField name='status'>
              {(field) => (
                <field.Select isRequired label={t`Status`} placeholder={t`Select status`}>
                  {productRequestStatusOptions.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {t(item.label)}
                    </SelectItem>
                  ))}
                </field.Select>
              )}
            </form.AppField>
            <form.AppField name='answer'>
              {(field) => (
                <field.Textarea
                  label={t`Answer`}
                  placeholder={t`Price, availability and delivery time`}
                  rows={4}
                />
              )}
            </form.AppField>
          </form>
        </form.AppForm>
        <Button
          className='ml-auto w-fit'
          type='submit'
          form='product-request-form'
          loading={patchMutation.isPending}
        >
          {t`Save changes`}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
