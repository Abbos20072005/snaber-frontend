import { msg } from '@lingui/core/macro';
import {
  BellRingIcon,
  // FEATURE DISABLED: Admin — company drafts moderation.
  // Building2Icon,
  CircleCheckBigIcon,
  GalleryVerticalEndIcon,
  LayoutDashboardIcon,
  PackageCheckIcon,
  PackageIcon,
  ShapesIcon,
  ShelvingUnitIcon,
  SpaceIcon,
  UsersIcon,
  WholeWordIcon
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
            url: '/admin/dashboard'
          },
          {
            icon: UsersIcon,
            title: msg`User Management`,
            url: '/admin/users'
          },
          {
            title: msg`Categories`,
            url: '/admin/category',
            icon: ShapesIcon
          },
          {
            title: msg`Products`,
            url: '/admin/products',
            icon: PackageIcon
          },
          {
            title: msg`Product checks`,
            url: '/admin/product-checks',
            icon: CircleCheckBigIcon
          },
          {
            title: msg`Orders`,
            url: '/admin/orders',
            icon: PackageCheckIcon
          },
          {
            icon: ShelvingUnitIcon,
            title: msg`Unit of Measure`,
            url: '/admin/unit-of-measure'
          },
          // FEATURE DISABLED: Admin — company drafts moderation.
          // {
          //   icon: Building2Icon,
          //   title: msg`Companies`,
          //   url: '/admin/companies'
          // },
          {
            icon: BellRingIcon,
            title: msg`Notifications`,
            url: '/admin/notifications'
          },
          {
            title: msg`Attributes`,
            icon: SpaceIcon,
            url: '/admin/attributes'
          },
          {
            title: msg`Attribute values`,
            icon: WholeWordIcon,
            url: '/admin/attribute-values'
          },
          {
            icon: GalleryVerticalEndIcon,
            title: msg`Contents`,
            items: [
              {
                title: msg`FAQs`,
                url: '/admin/contents/faqs'
              },
              {
                title: msg`About`,
                url: '/admin/contents/about'
              }
            ]
          }
        ]
      }
    ]
  };

  return sidebarData;
};
