import type { MessageDescriptor } from '@lingui/core';
import type { LinkProps } from '@tanstack/react-router';
import type React from 'react';

interface BaseNavItem {
  allowedRoles?: Array<UserRole> | UserRole;
  badge?: number | string | null | undefined;
  icon?: React.ElementType;
  params?: LinkProps['params'] | undefined;
  title: MessageDescriptor;
}

type NavLink = BaseNavItem & {
  url: LinkProps['to'];
  items?: never;
};

type NavCollapsible = BaseNavItem & {
  items: Array<BaseNavItem & { url: LinkProps['to'] }>;
  url?: never;
};

type NavItem = NavCollapsible | NavLink;

interface NavGroup {
  allowedRoles?: Array<UserRole> | UserRole;
  items: Array<NavItem>;
  title?: MessageDescriptor;
}

interface SidebarData {
  navGroups: Array<NavGroup>;
}

export type { NavCollapsible, NavGroup, NavItem, NavLink, SidebarData };
