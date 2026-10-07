import type { LinkProps } from '@tanstack/react-router';
import type { ReactNode } from 'react';

import { useLingui } from '@lingui/react/macro';
import { Link, useLocation } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';

import type { NavCollapsible, NavGroup, NavItem, NavLink } from '@/shared/ui/page/types';

import { usePermission } from '@/modules/auth';
import { Badge } from '@/shared/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/shared/ui/dropdown-menu';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar
} from '@/shared/ui/sidebar';

export const AppSidebarNavGroup = ({ title, items, allowedRoles }: NavGroup) => {
  const { t } = useLingui();
  const { state } = useSidebar();
  const { hasRole } = usePermission();

  const href = useLocation({ select: (location) => location.href });

  const filteredItems = items.filter((item) => !item.allowedRoles || hasRole(item.allowedRoles));

  if ((allowedRoles && !hasRole(allowedRoles)) || !filteredItems.length) return;

  return (
    <SidebarGroup>
      {title && <SidebarGroupLabel>{t(title)}</SidebarGroupLabel>}
      <SidebarMenu>
        {filteredItems.map((item, index) => {
          const key = `${item.title}-${index}`;

          if (!item.items) return <SidebarMenuLink href={href} key={key} item={item} />;

          if (state === 'collapsed')
            return <SidebarMenuCollapsedDropdown href={href} key={key} item={item} />;

          return <SidebarMenuCollapsible href={href} key={key} item={item} />;
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
};

const NavBadge = ({ children }: { children: ReactNode }) => (
  <Badge className='ml-auto size-5 rounded-full text-xs'>{children}</Badge>
);

const SidebarMenuLink = ({ item, href }: { item: NavLink; href: string }) => {
  const { t } = useLingui();
  const { setOpenMobile } = useSidebar();
  return (
    <SidebarMenuItem className='mb-0.5'>
      <SidebarMenuButton
        isActive={checkIsActive(href, item)}
        render={<Link params={item.params} onClick={() => setOpenMobile(false)} to={item.url} />}
        tooltip={t(item.title)}
      >
        {item.icon && <item.icon />}
        <span>{t(item.title)}</span>
        {item.badge && <NavBadge>{item.badge}</NavBadge>}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

const SidebarMenuCollapsible = ({ item, href }: { item: NavCollapsible; href: string }) => {
  const { t } = useLingui();
  const { setOpenMobile } = useSidebar();
  return (
    <Collapsible
      render={
        <SidebarMenuItem>
          <CollapsibleTrigger
            render={
              <SidebarMenuButton tooltip={t(item.title)}>
                {item.icon && <item.icon />}
                <span>{t(item.title)}</span>
                {item.badge && <NavBadge>{item.badge}</NavBadge>}
                <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
              </SidebarMenuButton>
            }
          />
          <CollapsibleContent className='CollapsibleContent'>
            <SidebarMenuSub>
              {item.items.map((subItem) => (
                <SidebarMenuSubItem key={subItem.url}>
                  <SidebarMenuSubButton
                    render={
                      <Link
                        params={subItem.params}
                        onClick={() => setOpenMobile(false)}
                        to={subItem.url}
                      />
                    }
                    isActive={checkIsActive(href, subItem)}
                  >
                    {subItem.icon && <subItem.icon />}
                    <span className='flex-1 truncate text-nowrap'>{t(subItem.title)}</span>
                    {checkAndReturnBadgeVal(subItem.badge) && <NavBadge>{subItem.badge}</NavBadge>}
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      }
      className='group/collapsible'
      defaultOpen={checkIsActive(href, item, true)}
    />
  );
};

const SidebarMenuCollapsedDropdown = ({ item, href }: { item: NavCollapsible; href: string }) => {
  const { t } = useLingui();
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <SidebarMenuButton isActive={checkIsActive(href, item)} tooltip={t(item.title)}>
              {item.icon && <item.icon />}
              <span>{t(item.title)}</span>
              {item.badge && <NavBadge>{item.badge}</NavBadge>}
              <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
            </SidebarMenuButton>
          }
        />
        <DropdownMenuContent align='start' side='right' sideOffset={4}>
          <DropdownMenuLabel>
            {t(item.title)} {item.badge ? `(${item.badge})` : ''}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {item.items.map((sub) => (
            <DropdownMenuItem
              key={`${sub.title}-${sub.url}`}
              render={
                <Link
                  className={`${checkIsActive(href, sub) ? 'bg-secondary' : ''}`}
                  params={sub.params}
                  to={sub.url}
                >
                  {sub.icon && <sub.icon />}
                  <span className='max-w-52 text-wrap'>{t(sub.title)}</span>
                  {checkAndReturnBadgeVal(sub.badge) && (
                    <span className='ml-auto text-xs'>
                      <Badge className='size-5 rounded-full'>{String(sub.badge)}</Badge>
                    </span>
                  )}
                </Link>
              }
            />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};

const checkAndReturnBadgeVal = (val: number | string | null | undefined): boolean =>
  !(val === undefined || val === null);

const resolve = (tpl?: string, p?: LinkProps['params']) => {
  if (!tpl || !p) return tpl;
  const dict = new Map<string, unknown>(Object.entries(p as Record<string, unknown>));
  return tpl.replace(/\$(\w+)/g, (m, k) => {
    const v = dict.get(k);
    return v == null ? m : encodeURIComponent(String(v));
  });
};

const startsWithSeg = (h: string, b?: string) =>
  !!b && (h === b || h.startsWith(b.endsWith('/') ? b : `${b}/`));

const firstSeg = (s?: string) => s?.split('/')[1] ?? '';

const stripQuery = (url: string) => url.split(/[?#]/)[0];

export function checkIsActive(href: string, item: Omit<NavItem, 'title'>, mainNav = false) {
  const cleanHref = stripQuery(href);
  const url = stripQuery(resolve(item.url, item.params) ?? '');

  return (
    startsWithSeg(cleanHref, url) ||
    item.items?.some((i) => stripQuery(resolve(i.url, i.params) ?? '') === cleanHref) ||
    (mainNav && firstSeg(cleanHref) === firstSeg(url)) ||
    false
  );
}
