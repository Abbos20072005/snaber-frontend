import type { MessageDescriptor } from '@lingui/core';

import { msg } from '@lingui/core/macro';

export const notificationTypeLabelMap: Record<NotificationType, MessageDescriptor> = {
  chat: msg`Chat`,
  company: msg`Company`,
  order: msg`Order`,
  other: msg`Other`,
  product: msg`Product`
};

export const notificationTypeColorMap: Record<NotificationType, string> = {
  chat: '#0EA5E9',
  company: '#6366F1',
  order: '#F97316',
  other: '#64748B',
  product: '#22C55E'
};

const notificationPathMapBuyer: Record<NotificationType, string | undefined> = {
  // FEATURE DISABLED: Chat functionality.
  // chat: '/profile/orders',
  chat: undefined,
  order: '/profile/orders',
  // FEATURE DISABLED: Companies list page.
  // company: '/companies',
  company: undefined,
  product: '/product',
  other: undefined
};

const notificationPathMapSeller: Record<NotificationType, string | undefined> = {
  // FEATURE DISABLED: Chat functionality.
  // chat: '/seller/chats',
  chat: undefined,
  order: '/seller/orders',
  // FEATURE DISABLED: Seller — mini-site generator.
  // company: '/seller/company/site-generator',
  company: undefined,
  product: '/seller/products/',
  other: undefined
};

const notificationPathMap: Record<NotificationType, string | undefined> = {
  chat: undefined,
  order: '/admin/orders',
  // FEATURE DISABLED: Admin — company drafts moderation.
  // company: '/admin/companies',
  company: undefined,
  product: '/admin/products/',
  other: undefined
};

export const getNotificationLink = (
  type: NotificationType,
  redirectId: number | string,
  role: UserRole
) => {
  let path;
  if (role === 'buyer') {
    path = notificationPathMapBuyer[type];
    return path ? `${path}/${redirectId}` : undefined;
  } else if (role === 'seller') {
    path = notificationPathMapSeller[type];
    return type === 'product' && path ? `${path}/${redirectId}` : path;
  } else {
    path = notificationPathMap[type];
    return type === 'product' && path ? `${path}/${redirectId}` : path;
  }
};
