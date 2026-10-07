import { useLingui } from '@lingui/react/macro';

import { Badge } from '@/shared/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Field, FieldContent, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';

export const SettingsGeneralTab = () => {
  const { t } = useLingui();
  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader className='border-b'>
          <CardTitle>{t`Profile Information`}</CardTitle>
          <CardDescription>{t`Editable identity and contact information.`}</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor='full_name'>{t`Full name`}</FieldLabel>
              <FieldContent>
                <Input id='full_name' placeholder={t`Enter full name`} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor='email'>Email</FieldLabel>
              <FieldContent>
                <Input id='email' type='email' placeholder='company@example.com' />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor='phone_number'>{t`Phone number`}</FieldLabel>
              <FieldContent>
                <Input id='phone_number' placeholder='+998 90 123 45 67' />
              </FieldContent>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='border-b'>
          <CardTitle>{t`Account Status`}</CardTitle>
          <CardDescription>{t`Read-only status from your user account.`}</CardDescription>
        </CardHeader>
        <CardContent className='grid gap-3 sm:grid-cols-2'>
          <div className='bg-background/80 border-border/60 border p-3'>
            <p className='text-muted-foreground text-[11px] uppercase'>{t`Role`}</p>
            <p className='mt-1 text-sm font-medium'>{t`Seller`}</p>
          </div>
          <div className='bg-background/80 border-border/60 border p-3'>
            <p className='text-muted-foreground text-[11px] uppercase'>{t`Account id`}</p>
            <p className='mt-1 text-sm font-medium'>{t`Not assigned`}</p>
          </div>
          <div className='bg-background/80 border-border/60 border p-3'>
            <p className='text-muted-foreground text-[11px] uppercase'>{t`Activity`}</p>
            <p className='mt-1 text-sm font-medium'>{t`Active`}</p>
          </div>
          <div className='bg-background/80 border-border/60 border p-3'>
            <p className='text-muted-foreground text-[11px] uppercase'>{t`Verification`}</p>
            <p className='mt-1 text-sm font-medium'>{t`Unverified`}</p>
          </div>
          <div className='bg-background/80 border-border/60 border p-3 sm:col-span-2'>
            <p className='text-muted-foreground text-[11px] uppercase'>{t`Block status`}</p>
            <div className='mt-1 flex items-center gap-2'>
              <p className='text-sm font-medium'>{t`Blocked`}</p>
              <Badge
                className='border-destructive/35 bg-destructive/10 text-destructive'
                variant='outline'
              >
                {t`Restricted`}
              </Badge>
            </div>
            <p className='text-muted-foreground mt-2 text-xs'>
              {t`Reason`}: {t`No reason provided`}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
