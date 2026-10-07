import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

import { AUTH_QUERY_KEYS } from '@/modules/auth';
import { patchAuthMePassword } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { useAppForm } from '@/shared/ui/form/hooks';

import type { PasswordFormSchema } from './constants';

import { passwordFormSchema } from './constants';

const defaultValues = {
  old_password: '',
  new_password: '',
  confirm_password: ''
} satisfies PasswordFormSchema as PasswordFormSchema;

export const PasswordForm = () => {
  const { t } = useLingui();

  const form = useAppForm({
    validators: {
      onChange: passwordFormSchema()
    },
    defaultValues,
    onSubmit: ({ value }) => {
      passwordMutation.mutate({
        data: value
      });
    }
  });

  const passwordMutation = useMutation({
    mutationFn: patchAuthMePassword,
    onSuccess: () => {
      toast.success(t`Password updated successfully`);
      form.reset(defaultValues);
    },
    onError: (data) => {
      if (
        data instanceof AxiosError &&
        data.response?.data.message_key === 'incorrect_old_password'
      )
        toast.error(t`The old password you entered is incorrect. Please try again.`);
      else toast.error(t`Password updated failed`);
    },
    meta: {
      withoutToastOnError: true,
      invalidatesQuery: [...AUTH_QUERY_KEYS.me()]
    }
  });

  return (
    <form.AppForm>
      <form
        className='space-y-4'
        id='password-form'
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <form.AppField name='old_password'>
          {(field) => (
            <field.PasswordInput isRequired label={t`Old password`} placeholder='********' />
          )}
        </form.AppField>
        <form.AppField name='new_password'>
          {(field) => (
            <field.PasswordInput isRequired label={t`New password`} placeholder='********' />
          )}
        </form.AppField>
        <form.AppField name='confirm_password'>
          {(field) => (
            <field.PasswordInput
              isRequired
              label={t`Confirm new password`}
              placeholder='********'
            />
          )}
        </form.AppField>
        <div className='flex justify-end'>
          <Button type='submit' loading={passwordMutation.isPending}>
            {t`Update password`}
          </Button>
        </div>
      </form>
    </form.AppForm>
  );
};
