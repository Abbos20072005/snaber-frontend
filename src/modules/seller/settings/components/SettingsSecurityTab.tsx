import { useLingui } from '@lingui/react/macro';
import { LogOutIcon } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Field, FieldContent, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { PasswordInput } from '@/shared/ui/password-input';

export const SettingsSecurityTab = () => {
  const { t } = useLingui();
  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader className='border-b'>
          <CardTitle>{t`Security`}</CardTitle>
          <CardDescription>{t`Password update and session controls.`}</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor='current_password'>{t`Current password`}</FieldLabel>
              <FieldContent>
                <PasswordInput id='current_password' placeholder={t`Enter current password`} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor='new_password'>{t`New password`}</FieldLabel>
              <FieldContent>
                <PasswordInput id='new_password' placeholder={t`Minimum 8 characters`} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor='confirm_password'>{t`Confirm new password`}</FieldLabel>
              <FieldContent>
                <PasswordInput id='confirm_password' placeholder={t`Repeat new password`} />
              </FieldContent>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
      <Card className='border-destructive/35'>
        <CardHeader className='border-destructive/25 border-b'>
          <CardTitle>{t`Danger Zone`}</CardTitle>
          <CardDescription>{t`High-risk actions that impact account access.`}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button type='button' variant='destructive'>
            <LogOutIcon />
            {t`Logout`}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
