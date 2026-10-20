import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { postOtpSend } from '@/shared/api';
import { useAuthContext } from '@/shared/context';
import { Button } from '@/shared/ui/button';
import { useAppForm } from '@/shared/ui/form/hooks';

import { phoneFormSchema } from './constants';

export const PhoneForm = () => {
  const { t } = useLingui();
  const { setStep, setPhone, setResendAt } = useAuthContext();

  const postOtpSendMutation = useMutation({
    mutationFn: postOtpSend,
    onSuccess: ({ data }, { data: { phone_number } }) => {
      setPhone(phone_number);
      setResendAt(Date.now() + data.result.resend_after * 1000);
      setStep('verify');
      toast.success(t`Verification code sent`);
    }
  });

  const form = useAppForm({
    validators: { onChange: phoneFormSchema() },
    defaultValues: {
      phone_number: ''
    },
    onSubmit: ({ value }) => {
      postOtpSendMutation.mutate({ data: value });
    }
  });

  return (
    <form.AppForm>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <div className='grid gap-3'>
          <form.AppField name='phone_number'>
            {(field) => (
              <field.PhoneInput isRequired label={t`Phone number`} placeholder='90 123 45 67' />
            )}
          </form.AppField>
          <Button
            className='mt-2'
            disabled={postOtpSendMutation.isPending}
            type='submit'
            loading={postOtpSendMutation.isPending}
          >
            {t`Get code`}
          </Button>
        </div>
      </form>
    </form.AppForm>
  );
};
