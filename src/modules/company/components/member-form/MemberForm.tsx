import { useLingui } from '@lingui/react/macro';

import { useAppForm } from '@/shared/ui/form/hooks';

import type { CreateMemberFormValues } from './constants';

import { useCreateMemberSchema } from './constants';

interface Props {
  onSubmit: (val: CreateMemberFormValues) => void;
}

export const MemberForm = ({ onSubmit }: Props) => {
  const { t } = useLingui();
  const form = useAppForm({
    validators: {
      onChange: useCreateMemberSchema()
    },
    defaultValues: {
      full_name: '',
      email: '',
      phone_number: '',
      password: ''
    } satisfies CreateMemberFormValues as CreateMemberFormValues,
    onSubmit: ({ value }) => {
      console.log(value);

      onSubmit(value);
    }
  });

  return (
    <form.AppForm>
      <form
        className='grid gap-4'
        id='member-form'
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <form.AppField name='full_name'>
          {(field) => (
            <field.Input isRequired label={t`Full name`} placeholder={t`Enter full name`} />
          )}
        </form.AppField>

        <form.AppField name='email'>
          {(field) => (
            <field.Input isRequired label='Email' type='email' placeholder={t`Enter email`} />
          )}
        </form.AppField>

        <form.AppField name='phone_number'>
          {(field) => (
            <field.PhoneInput
              isRequired
              label={t`Phone number`}
              placeholder={t`Enter phone number`}
            />
          )}
        </form.AppField>

        <form.AppField name='password'>
          {(field) => (
            <field.PasswordInput isRequired label={t`Password`} placeholder={t`Enter password`} />
          )}
        </form.AppField>
      </form>
    </form.AppForm>
  );
};
