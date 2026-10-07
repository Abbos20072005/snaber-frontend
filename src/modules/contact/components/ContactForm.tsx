import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { postContact } from '@/shared/api/requests/contact';
import { Button } from '@/shared/ui/button';
import { useAppForm } from '@/shared/ui/form/hooks';

import { contactFormschema } from '../constants';

export const ContactForm = () => {
  const { t } = useLingui();

  const form = useAppForm({
    validators: { onChange: contactFormschema() },
    defaultValues: {
      full_name: '',
      email: '',
      topic: '',
      message: ''
    },
    onSubmit: ({ value }) => {
      postContactMutation.mutate({ data: value });
    }
  });

  const postContactMutation = useMutation({
    mutationFn: postContact,
    onSuccess: () => {
      toast.success(t`Your request has been sent successfully!`);
      form.reset();
    }
  });

  return (
    <form.AppForm>
      <form
        className='space-y-4'
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className='grid gap-4 md:grid-cols-2'>
          <form.AppField name='full_name'>
            {(field) => (
              <field.Input isRequired label={t`Full name`} placeholder={t`Enter your full name`} />
            )}
          </form.AppField>
          <form.AppField name='email'>
            {(field) => (
              <field.Input isRequired label='Email' placeholder={t`Enter your email address`} />
            )}
          </form.AppField>
        </div>

        <form.AppField name='topic'>
          {(field) => (
            <field.Input
              isRequired
              label={t`Topic`}
              placeholder={t`What would you like to discuss?`}
            />
          )}
        </form.AppField>

        <form.AppField name='message'>
          {(field) => (
            <field.Textarea
              isRequired
              label={t`Message`}
              placeholder={t`Tell us about your production, sourcing, or partnership needs`}
            />
          )}
        </form.AppField>
        <Button className='mt-2 w-full' type='submit' loading={postContactMutation.isPending}>
          {t`Submit`}
        </Button>
      </form>
    </form.AppForm>
  );
};
