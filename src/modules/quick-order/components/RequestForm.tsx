import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

import { useAuth } from '@/modules/auth';
import { PRODUCT_REQUESTS_QUERY_KEYS } from '@/modules/product-requests';
import { postProductRequest } from '@/shared/api';
import { toFormData } from '@/shared/lib/form-data';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { useAppForm } from '@/shared/ui/form/hooks';

import type { RequestFormSchema } from '../constants';

import { requestFormSchema } from '../constants';

interface Props {
  items: { name: string; quantity: number }[];
}

export const RequestForm = ({ items }: Props) => {
  const { t } = useLingui();
  const { user } = useAuth();
  const navigate = useNavigate();

  const requestMutation = useMutation({
    mutationFn: postProductRequest,
    onSuccess: () => {
      if (user) {
        toast.success(t`Request sent. We will answer you soon.`);
        void navigate({ to: '/profile/requests' });
        return;
      }
      toast.success(t`Request sent. Log in with this phone number to follow it in your profile.`);
      void navigate({ to: '/' });
    },
    onError: () => toast.error(t`Failed to send the request.`),
    meta: {
      invalidatesQuery: [...PRODUCT_REQUESTS_QUERY_KEYS.base()],
      withoutToastOnError: true
    }
  });

  const onSubmitForm = (value: RequestFormSchema) => {
    if (items.length === 0 && value.file.length === 0 && !value.comment.trim()) {
      toast.error(t`Write what you need or attach a file.`);
      return;
    }

    requestMutation.mutate({
      data: toFormData({
        comment: value.comment,
        file: value.file[0],
        items: JSON.stringify(items),
        phone_number: user ? undefined : value.phone_number
      })
    });
  };

  const form = useAppForm({
    validators: {
      onChange: requestFormSchema(!user)
    },
    defaultValues: {
      comment: '',
      file: [],
      phone_number: ''
    } satisfies RequestFormSchema as RequestFormSchema,
    onSubmit: ({ value }) => onSubmitForm(value)
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t`Cannot find the products?`}</CardTitle>
        <CardDescription>
          {t`Send us a photo of your list, your Excel file or just describe what you need. We will find the products and answer with prices.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form.AppForm>
          <form
            className='grid gap-4'
            onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              void form.handleSubmit();
            }}
          >
            {items.length > 0 && (
              <ul className='bg-muted space-y-1 rounded-lg p-3 text-sm'>
                {items.map((item, index) => (
                  <li key={`${item.name}-${index}`}>
                    {item.name} <span className='text-muted-foreground'>× {item.quantity}</span>
                  </li>
                ))}
              </ul>
            )}
            <form.AppField name='file'>
              {(field) => (
                <field.FileUpload
                  accept='image/*,.pdf,.xlsx,.csv'
                  label={t`Photo or file`}
                  maxFiles={1}
                  uploadHint={t`Drop a photo of the list or an Excel file here`}
                />
              )}
            </form.AppField>
            {!user && (
              <form.AppField name='phone_number'>
                {(field) => (
                  <field.PhoneInput isRequired label={t`Phone number`} placeholder='90 123 45 67' />
                )}
              </form.AppField>
            )}
            <form.AppField name='comment'>
              {(field) => (
                <field.Textarea
                  label={t`Comment`}
                  placeholder={t`Which products do you need and in what quantity?`}
                  rows={3}
                />
              )}
            </form.AppField>
            <Button className='ml-auto w-fit' type='submit' loading={requestMutation.isPending}>
              {t`Send request`}
            </Button>
          </form>
        </form.AppForm>
      </CardContent>
    </Card>
  );
};
