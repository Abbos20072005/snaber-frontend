import { useLingui } from '@lingui/react/macro';

import { userRoleOptions } from '@/modules/users';
import { useAppForm } from '@/shared/ui/form/hooks';
import { SelectItem } from '@/shared/ui/select';

import type { UserFormSchema } from './constants';

import { userFormSchema } from './constants';

interface Props {
  defaultValues?: Partial<User>;
  roleDisabled?: boolean;
  onSubmit: (value: UserFormSchema) => void;
}

export const UserForm = ({ defaultValues, roleDisabled = false, onSubmit }: Props) => {
  const { t } = useLingui();

  const form = useAppForm({
    validators: {
      onChange: userFormSchema()
    },
    defaultValues: {
      full_name: defaultValues?.full_name || '',
      email: defaultValues?.email || '',
      phone_number: defaultValues?.phone_number || '',
      role: defaultValues?.role || 'buyer',
      is_active: !!defaultValues?.is_active,
      is_blocked: !!defaultValues?.is_blocked,
      block_reason: defaultValues?.block_reason || ''
    } satisfies UserFormSchema as UserFormSchema,
    onSubmit: ({ value }) => {
      onSubmit(value);
    }
  });

  return (
    <form.AppForm>
      <form
        className='grid gap-4'
        id='user-form'
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
        <form.AppField name='role'>
          {(field) => (
            <field.Select
              isRequired
              disabled={roleDisabled}
              label={t`Role`}
              placeholder={t`Select role`}
            >
              {userRoleOptions.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {t(item.label)}
                </SelectItem>
              ))}
            </field.Select>
          )}
        </form.AppField>
        <form.AppField name='is_active'>
          {(field) => <field.Checkbox isRequired label={t`Is active`} />}
        </form.AppField>
        <form.AppField name='is_blocked'>
          {(field) => <field.Checkbox label={t`Is blocked`} />}
        </form.AppField>
        <form.AppField name='block_reason'>
          {(field) => (
            <field.Textarea label={t`Block reason`} placeholder={t`Enter block reason`} rows={3} />
          )}
        </form.AppField>
      </form>
    </form.AppForm>
  );
};
