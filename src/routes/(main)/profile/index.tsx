import type { MessageDescriptor } from '@lingui/core';
import type { LinkProps } from '@tanstack/react-router';

import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react/macro';
import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import {
  BarChart3Icon,
  BellIcon,
  // FEATURE DISABLED: Companies list page.
  // Building2Icon,
  ChevronRightIcon,
  CircleAlertIcon,
  HeartIcon,
  LayoutGridIcon,
  PackageIcon,
  SettingsIcon,
  ShoppingCartIcon
} from 'lucide-react';

import { getAuthMeQueryOptions, useAuthed } from '@/modules/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { SectionWrapper } from '@/shared/ui/section-wrapper';

import { MobileContactDrawer } from '../-components';

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
    label: msg`Notifications`,
    to: '/profile/notifications',
    icon: BellIcon,
    exact: false
  },
  {
    label: msg`Settings`,
    to: '/profile/settings',
    icon: SettingsIcon,
    exact: false
  },
  // FEATURE DISABLED: Companies list page.
  // {
  //   label: msg`Companies`,
  //   to: '/companies',
  //   icon: Building2Icon,
  //   exact: false
  // },
  {
    label: msg`Catalog`,
    to: '/catalog',
    icon: LayoutGridIcon,
    exact: false
  },
  {
    label: msg`Cart`,
    to: '/cart',
    icon: HeartIcon,
    exact: false
  },
  {
    label: msg`Favorites`,
    to: '/favorites',
    icon: ShoppingCartIcon,
    exact: false
  },
  {
    label: msg`About`,
    to: '/about',
    icon: CircleAlertIcon,
    exact: false
  }
] as const;

const MobileProfile = () => {
  const { t } = useLingui();
  const { user } = useAuthed();
  const AVATAR_IMAGE = user?.image;

  return (
    <div className='md:hidden'>
      <SectionWrapper
        content={
          <>
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
          </>
        }
      >
        <div>
          {sections.map((section) => (
            <Link
              key={section.to}
              className='text-muted-foreground hover:text-foreground flex w-full shrink-0 items-center justify-between border-b py-3 text-sm whitespace-nowrap transition-colors'
              activeOptions={{ exact: section.exact }}
              to={section.to}
            >
              <div className='flex items-center justify-start gap-2'>
                <section.icon className='size-4' />
                {t(section.label)}
              </div>
              <ChevronRightIcon />
            </Link>
          ))}
          <MobileContactDrawer />
        </div>
      </SectionWrapper>
    </div>
  );
};

export const Route = createFileRoute('/(main)/profile/')({
  component: MobileProfile,
  loader: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(getAuthMeQueryOptions());
    if (user.role !== 'buyer') throw redirect({ to: '/' });
  }
});
