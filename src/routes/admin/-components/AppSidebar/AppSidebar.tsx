import { useLingui } from '@lingui/react/macro';
import { Link } from '@tanstack/react-router';
import { LogOutIcon, PanelLeftOpenIcon, SettingsIcon } from 'lucide-react';
import * as React from 'react';

import { AlertLogoutDialog } from '@/modules/auth/components';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar
} from '@/shared/ui/sidebar';

import { AppSidebarNavGroup } from './AppSidebarNavGroup';
import { useSidebarData } from './useSidebarData';

export const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const { t } = useLingui();
  const { open, setOpen } = useSidebar();
  const sidebarData = useSidebarData();

  return (
    <>
      <Sidebar className='group' collapsible='icon' {...props}>
        <SidebarHeader>
          <SidebarMenuItem className='flex items-center justify-between gap-4 py-2'>
            <SidebarMenuButton
              className='hover:bg-sidebar w-fit justify-start px-2 group-data-[collapsible=icon]:p-1!'
              render={<Link to='/' />}
            >
              {open ? (
                <img alt='Logo' className='size-10 shrink-0' src='/images/b2b-market-icon.svg' />
              ) : (
                <img
                  alt='Logo'
                  className='max-size-10 shrink-0'
                  src='/images/b2b-market-icon.svg'
                />
              )}
              <span className='text-xl font-semibold'>B2B</span>
            </SidebarMenuButton>
            {open && (
              <SidebarTrigger
                className='text-primary opacity-0 group-hover:opacity-100'
                size='icon'
              />
            )}
          </SidebarMenuItem>
        </SidebarHeader>
        <SidebarFooter>
          <SidebarMenu>
            {!open && (
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setOpen(true)} tooltip={t`Open panel`}>
                  <PanelLeftOpenIcon />
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarFooter>
        <SidebarContent className='divide-y'>
          {sidebarData.navGroups.map((group, index) => (
            <AppSidebarNavGroup key={index} {...group} />
          ))}
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={
                  <Link hash='settings' to='/admin/profile'>
                    <SettingsIcon />
                    {t`Settings`}
                  </Link>
                }
                tooltip={t`Settings`}
              />
            </SidebarMenuItem>
            <SidebarMenuItem>
              <AlertLogoutDialog>
                <SidebarMenuButton tooltip={t`Logout`}>
                  <LogOutIcon />
                  {t`Logout`}
                </SidebarMenuButton>
              </AlertLogoutDialog>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </>
  );
};
