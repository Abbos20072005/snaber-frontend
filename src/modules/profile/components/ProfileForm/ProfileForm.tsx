import { useLingui } from '@lingui/react/macro';

import { useAppForm } from '@/shared/ui/form/hooks';

import type { ProfileFormSchema } from './constants';

import { profileFormSchema } from './constants';

interface Props {
  defaultValues?: Partial<User>;
  formId: string;
  onSubmit?: (value: ProfileFormSchema) => void;
}

export const ProfileForm = ({ defaultValues, onSubmit, formId }: Props) => {
  const { t } = useLingui();

  const form = useAppForm({
    validators: {
      onChange: profileFormSchema()
    },
    defaultValues: {
      full_name: defaultValues?.full_name || '',
      email: defaultValues?.email || '',
      phone_number: defaultValues?.phone_number || ''
    } satisfies ProfileFormSchema as ProfileFormSchema,
    onSubmit: ({ value }) => {
      onSubmit?.(value);
    }
  });

  return (
    <form.AppForm>
      <form
        className='space-y-4'
        id={formId}
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <div className='grid gap-4 sm:grid-cols-2'>
          <form.AppField name='full_name'>
            {(field) => (
              <field.Input isRequired label={t`Full name`} placeholder={t`Last name First name`} />
            )}
          </form.AppField>
          <form.AppField name='phone_number'>
            {(field) => (
              <field.PhoneInput disabled label={t`Phone number`} placeholder='99112223344' />
            )}
          </form.AppField>
        </div>
        <form.AppField name='email'>
          {(field) => (
            <field.Input disabled label='Email' type='email' placeholder='mirmaxsudov@gmail.com' />
          )}
        </form.AppField>
      </form>
    </form.AppForm>
  );
};
