import { useLingui } from '@lingui/react/macro';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';

import { PasswordForm } from './PasswordForm';

export const PasswordSection = () => {
  const { t } = useLingui();

  return (
    <Card className='scroll-mt-4' id='password'>
      <CardHeader>
        <CardTitle>{t`Password`}</CardTitle>
        <CardDescription>{t`Keep your account secure with a strong password.`}</CardDescription>
      </CardHeader>
      <CardContent>
        <PasswordForm />
      </CardContent>
    </Card>
  );
};
