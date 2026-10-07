import { useLingui } from '@lingui/react/macro';
import { LogOutIcon } from 'lucide-react';

import { AlertLogoutDialog } from '@/modules/auth/components';
import { Button } from '@/shared/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';

export const DangerZoneSection = () => {
  const { t } = useLingui();
  return (
    <Card className='border-destructive/30 scroll-mt-4' id='danger-zone'>
      <CardHeader>
        <CardTitle>{t`Danger zone`}</CardTitle>
        <CardDescription>
          {t`These actions are sensitive and may permanently affect your account.`}
        </CardDescription>
      </CardHeader>
      <CardFooter className='justify-end gap-2'>
        <AlertLogoutDialog>
          <Button variant='destructiveOutline'>
            <LogOutIcon />
            {t`Logout`}
          </Button>
        </AlertLogoutDialog>
      </CardFooter>
    </Card>
  );
};
