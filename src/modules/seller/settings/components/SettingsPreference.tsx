import { useLingui } from '@lingui/react/macro';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { FieldDescription, FieldTitle } from '@/shared/ui/field';
import { Label } from '@/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Separator } from '@/shared/ui/separator';
import { Switch } from '@/shared/ui/switch';

export const Preferences = () => {
  const { t } = useLingui();

  return (
    <Card className='h-fit'>
      <CardHeader className='border-b'>
        <CardTitle>{t`Preferences`}</CardTitle>
        <CardDescription>{t`Regional and communication preferences.`}</CardDescription>
      </CardHeader>
      <CardContent className='space-y-3'>
        <Label htmlFor='language'>{t`Language`}</Label>
        <Select>
          <SelectTrigger className='w-full sm:w-70' id='language'>
            <SelectValue placeholder={t`Select language`} />
          </SelectTrigger>
          <SelectContent>
            {[
              {
                value: 'UZ',
                label: t`Uzbek`
              },
              {
                value: 'RU',
                label: t`Russian`
              },
              {
                value: 'ENG',
                label: t`English`
              }
            ].map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Separator />
        <div className='space-y-3'>
          <div className='border-border/70 bg-background/60 flex items-start justify-between gap-3 border p-3'>
            <div className='space-y-1'>
              <FieldTitle className='font-medium'>{t`Email notifications`}</FieldTitle>
              <FieldDescription>
                {t`Receive account health and activity updates by email.`}
              </FieldDescription>
            </div>
            <Switch aria-label={t`Toggle email notifications`} />
          </div>
          <div className='border-border/70 bg-background/60 flex items-start justify-between gap-3 border p-3'>
            <div className='space-y-1'>
              <FieldTitle className='font-medium'>{t`Product updates`}</FieldTitle>
              <FieldDescription>
                {t`Get notifications about catalog updates and feature releases.`}
              </FieldDescription>
            </div>
            <Switch aria-label={t`Toggle product updates`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
