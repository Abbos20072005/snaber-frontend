import { msg } from '@lingui/core/macro';
import {
  BellRingIcon,
  CircleCheckBigIcon,
  LayoutDashboardIcon,
  // FEATURE DISABLED: Seller — chat center.
  // MessageSquareIcon,
  PackageCheckIcon,
  PackageIcon,
  // FEATURE DISABLED: Seller — mini-site generator.
  // PanelsTopLeftIcon
} from 'lucide-react';

import type { SidebarData } from '@/shared/ui/page/types';

export const useSidebarData = () => {
  const sidebarData: SidebarData = {
    navGroups: [
      {
        items: [
          {
            icon: LayoutDashboardIcon,
            title: msg`Dashboard`,
            url: '/seller/dashboard'
          },
          // FEATURE DISABLED: Seller — mini-site generator.
          // {
          //   icon: PanelsTopLeftIcon,
          //   title: msg`Mini site`,
          //   url: '/seller/company/site-generator'
          // },
          {
            title: msg`Notifications`,
            url: '/seller/notifications',
            icon: BellRingIcon
          },
          {
            title: msg`Products`,
            url: '/seller/products',
            icon: PackageIcon
          },
          {
            title: msg`Draft products`,
            url: '/seller/product-checks',
            icon: CircleCheckBigIcon
          },
          // FEATURE DISABLED: Seller — chat center.
          // {
          //   title: msg`Chats`,
          //   url: '/seller/chats',
          //   icon: MessageSquareIcon
          // },
          {
            title: msg`Orders`,
            url: '/seller/orders',
            icon: PackageCheckIcon
          }
        ]
      }
    ]
  };

  return sidebarData;
};
