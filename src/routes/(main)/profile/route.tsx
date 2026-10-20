import type { MessageDescriptor } from '@lingui/core';
import type { LinkProps } from '@tanstack/react-router';
import type React from 'react';

import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react/macro';
import { createFileRoute, Link, Outlet, redirect } from '@tanstack/react-router';
import { BarChart3Icon, PackageIcon, SettingsIcon } from 'lucide-react';

import { getAuthMeQueryOptions, useAuthed } from '@/modules/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { GeneralError, NotFoundError } from '@/shared/ui/errors';
import { PageLoading } from '@/shared/ui/page';

const sections: {
  label: MessageDescriptor;
  to: LinkProps['to'];
  icon: React.ElementType;
  exact: boolean;
}[] = [
  {
    label: msg`Dashboard`,
    to: '/profile/dashboard',
    icon: BarChart3Icon,
    exact: false
  },
  {
    label: msg`Orders`,
    to: '/profile/orders',
    icon: PackageIcon,
    exact: false
  },
  {
    label: msg`Settings`,
    to: '/profile/settings',
    icon: SettingsIcon,
    exact: false
  }
] as const;

const ProfileLayout = () => {
  const { t } = useLingui();
  const { user } = useAuthed();
  const AVATAR_IMAGE = user?.image;

  return (
    <div className='mb-0 gap-4 space-y-4 sm:mt-6 md:container md:mt-8 md:grid md:min-h-[calc(100dvh-4rem)] md:grid-cols-[300px_minmax(0,1fr)] md:space-y-0'>
      <Card className='hidden space-y-3 md:sticky md:top-20 md:block md:h-fit'>
        <CardHeader className='border-b'>
          <CardTitle>{t`My Account`}</CardTitle>
          <div className='flex items-center gap-2'>
            <Avatar>
              <AvatarImage src={AVATAR_IMAGE} />
              <AvatarFallback>
                <span className='text-primary font-medium uppercase'>{user?.full_name[0]}</span>
              </AvatarFallback>
            </Avatar>
            <div>
              <p className='text-foreground text-sm font-bold'>{user?.full_name ?? t`User`}</p>
              <p className='text-muted-foreground max-w-full truncate text-xs'>
                {user?.email ?? t`User email`}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {sections.map((section) => (
            <Link
              key={section.to}
              className='text-muted-foreground hover:text-foreground flex w-full shrink-0 items-center justify-start gap-2 rounded-lg px-3 py-2 text-sm whitespace-nowrap transition-colors'
              activeOptions={{ exact: section.exact }}
              activeProps={{
                className:
                  'bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary font-medium'
              }}
              to={section.to}
            >
              <section.icon className='size-4' />
              {t(section.label)}
            </Link>
          ))}
        </CardContent>
      </Card>
      <div className='min-w-0 overflow-hidden'>
        <Outlet />
      </div>
    </div>
  );
};

export const Route = createFileRoute('/(main)/profile')({
  component: ProfileLayout,
  pendingComponent: PageLoading,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
  loader: async ({ context: { queryClient } }) => {
    const user = await queryClient.ensureQueryData(getAuthMeQueryOptions()).catch(() => {
      throw redirect({ to: '/' });
    });

    if (user.role === 'admin') throw redirect({ to: '/admin/dashboard' });

    if (user.role !== 'buyer') throw redirect({ to: '/' });

    return { user };
  }
});
