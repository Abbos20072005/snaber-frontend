import { useLingui } from '@lingui/react/macro';
import { useQuery } from '@tanstack/react-query';

import type { OAuthVerifyFormSchema } from '@/modules/oauth';

import { getCountryNameMap, getCountryQueryOptions } from '@/modules/country';
import { currencyLabelMap, getCurrencyQueryOptions } from '@/modules/currency';
import { oAuthVerifyFormSchema, rolesLabelMap, rolesLabelOptions } from '@/modules/oauth';
import { Button } from '@/shared/ui/button.tsx';
import { useAppForm } from '@/shared/ui/form/hooks';
import { SelectItem } from '@/shared/ui/select';

interface Props {
  isSubmitting?: boolean;
  user: OAuthGoogleData['user'];
  onSubmit: (data: OAuthVerifyFormSchema) => void;
}

export const OAuthVerifyForm = ({ isSubmitting = false, user, onSubmit }: Props) => {
  const { t } = useLingui();

  const countryQuery = useQuery(getCountryQueryOptions());
  const countries = countryQuery.data?.data || [];

  const currencyQuery = useQuery(getCurrencyQueryOptions());
  const currencies = currencyQuery.data?.data || [];

  const countryNameMap = getCountryNameMap(countries);

  const form = useAppForm({
    validators: { onChange: oAuthVerifyFormSchema() },
    defaultValues: {
      full_name: user.full_name,
      email: user.email,
      role: 'buyer' as Roles,
      country: '',
      currency: 'UZS',
      phone_number: ''
    } satisfies OAuthVerifyFormSchema as OAuthVerifyFormSchema,
    onSubmit: ({ value }) => onSubmit(value)
  });

  return (
    <form.AppForm>
      <form
        id='oAuth-verify-form'
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
          <form.AppField name='phone_number'>
            {(field) => (
              <field.PhoneInput isRequired label={t`Phone number`} placeholder='11222333' />
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
          <form.AppField name='currency'>
            {(field) => (
              <field.Select
                isRequired
                disabled={currencyQuery.isLoading}
                label={t`Currency`}
                renderValue={(val) => t(currencyLabelMap[val as CurrencyCode]) || val}
                placeholder={t`Select currency`}
              >
                {currencies.map(({ name, code }) => (
                  <SelectItem key={code} value={code}>
                    {name}
                  </SelectItem>
                ))}
              </field.Select>
            )}
          </form.AppField>
          <form.AppField name='email'>
            {(field) => <field.Input disabled isRequired label='Email' />}
          </form.AppField>
          <Button className='mt-2' type='submit' form='oAuth-verify-form' loading={isSubmitting}>
            {t`Complete`}
          </Button>
        </div>
      </form>
    </form.AppForm>
  );
};
