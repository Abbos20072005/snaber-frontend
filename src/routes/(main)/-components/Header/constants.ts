import type { MessageDescriptor } from '@lingui/core';
import type { LinkProps } from '@tanstack/react-router';

import { msg } from '@lingui/core/macro';

export const headerLinks: { label: MessageDescriptor; to: LinkProps['to'] }[] = [
  { label: msg`Delivery and payment`, to: '/delivery' },
  { label: msg`Service and support`, to: '/support' },
  { label: msg`About us`, to: '/about' }
];

export const footerLinks: { label: MessageDescriptor; to: LinkProps['to'] }[] = [
  { label: msg`Catalog`, to: '/catalog' },
  ...headerLinks
];
