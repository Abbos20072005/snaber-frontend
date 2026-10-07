import type { ComponentProps } from 'react';

import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react/macro';
import { BellIcon, KeyRoundIcon, ShieldAlertIcon, UserRoundIcon } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

const sections = [
  { id: 'profile', icon: UserRoundIcon, label: msg`Profile` },
  { id: 'password', icon: KeyRoundIcon, label: msg`Password` },
  { id: 'notifications', icon: BellIcon, label: msg`Notifications` },
  { id: 'danger-zone', icon: ShieldAlertIcon, label: msg`Danger zone` }
] as const;

type Props = ComponentProps<'div'>;

export const SettingsSidebar = (props: Props) => {
  const { t } = useLingui();

  return (
    <Card size='sm' {...props}>
      <CardHeader>
        <CardTitle className='tracking-wide'>{t`Settings`}</CardTitle>
      </CardHeader>
      <CardContent className='grid gap-1'>
        {sections.map(({ id, icon: Icon, label }) => (
          <a
            href={`#${id}`}
            key={id}
            className='text-muted-foreground hover:bg-muted hover:text-foreground inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors'
          >
            <Icon className='size-4' />
            {t(label)}
          </a>
        ))}
      </CardContent>
    </Card>
  );
};
