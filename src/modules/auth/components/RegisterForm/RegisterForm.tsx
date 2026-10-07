import { useLingui } from '@lingui/react/macro';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

import { getCountryNameMap, getCountryQueryOptions } from '@/modules/country';
import { postRegister } from '@/shared/api';
import { OAUTH_URL } from '@/shared/constants/oAuth';
import { useAuthContext } from '@/shared/context';
import { Button } from '@/shared/ui/button';
import { useAppForm } from '@/shared/ui/form/hooks';
import { SelectItem } from '@/shared/ui/select';

import type { RegisterFormSchema } from './constants';

import { registerFormSchema, rolesLabelMap, rolesLabelOptions } from './constants';

export const RegisterForm = () => {
  const { t } = useLingui();
  const { setStep, setEmail } = useAuthContext();
  const postRegisterMutation = useMutation({
    mutationFn: postRegister,
    onSuccess: () => {
      setStep('verify');
      toast.success(t`Verification code sent`);
    },
    meta: {
      withoutToastOnError: true
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) toast.error(t`Email already registered`);
      } else toast.error(t`Failed to register. Please try again`);
    }
  });

  const countryQuery = useQuery(getCountryQueryOptions());
  const countries = countryQuery.data?.data || [];
  const countryNameMap = getCountryNameMap(countries);

  const form = useAppForm({
    validators: { onChange: registerFormSchema() },
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      role: 'buyer' as Roles,
      country: ''
    } satisfies RegisterFormSchema as RegisterFormSchema,
    onSubmit: ({ value }) => {
      postRegisterMutation.mutate({ data: value });
      setEmail(value.email);
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
          <form.AppField name='full_name'>
            {(field) => (
              <field.Input isRequired label={t`Full name`} placeholder='John Doe' />
            )}
          </form.AppField>
          <form.AppField name='role'>
            {(field) => (
              <field.Select
                isRequired
                label={t`Role`}
                renderValue={(val) => t(rolesLabelMap[val as Roles])}
              >
                {rolesLabelOptions.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {t(label)}
                  </SelectItem>
                ))}
              </field.Select>
            )}
          </form.AppField>
          <form.AppField name='country'>
            {(field) => (
              <field.Select
                isRequired
                disabled={countryQuery.isLoading}
                label={t`Country`}
                renderValue={(val) => countryNameMap[val] || val}
                placeholder={t`Select country`}
              >
                {countries.map(({ name, code }) => (
                  <SelectItem key={code} value={code}>
                    {name}
                  </SelectItem>
                ))}
              </field.Select>
            )}
          </form.AppField>
          <form.AppField name='email'>
            {(field) => <field.Input isRequired label='Email' />}
          </form.AppField>
          <form.AppField name='password'>
            {(field) => (
              <field.PasswordInput isRequired label={t`Password`} placeholder='********' />
            )}
          </form.AppField>

          <Button
            className='mt-2'
            disabled={postRegisterMutation.isPending}
            type='submit'
            loading={postRegisterMutation.isPending}
          >
            {t`Continue`}
          </Button>
          <Button
            type='button'
            variant='outline'
            onClick={() => {
              window.location.href = OAUTH_URL;
            }}
          >
            <svg
              height='100'
              width='100'
              x='0px'
              xmlns='http://www.w3.org/2000/svg'
              y='0px'
              viewBox='0 0 48 48'
            >
              <path
                d='M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z'
                fill='#FFC107'
              ></path>
              <path
                d='M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z'
                fill='#FF3D00'
              ></path>
              <path
                d='M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z'
                fill='#4CAF50'
              ></path>
              <path
                d='M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z'
                fill='#1976D2'
              ></path>
            </svg>
            {t`Continue with Google`}
          </Button>
        </div>
      </form>
    </form.AppForm>
  );
};
