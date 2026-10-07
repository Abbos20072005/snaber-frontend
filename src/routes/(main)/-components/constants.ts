import type { MessageDescriptor } from '@lingui/core';
import type { LucideIcon } from 'lucide-react';

import { msg } from '@lingui/core/macro';
import { MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react';

interface ContactOption {
  href: string;
  icon: LucideIcon;
  label: MessageDescriptor;
  value: string;
}

export const contactsLabelMap: ContactOption[] = [
  {
    icon: PhoneIcon,
    label: msg`Phone`,
    value: '+998712037772',
    href: 'tel:+998712037772'
  },
  {
    icon: MailIcon,
    label: msg`Email`,
    value: 'info@snaber.uz',
    href: 'mailto:info@snaber.uz'
  },
  {
    icon: MapPinIcon,
    label: msg`Address`,
    value: '100192, Toshkent shahri, Mustaqillik shoh ko‘chasi, 109',
    href: 'https://maps.app.goo.gl/Bj9ruqUiLB2Y4cNt5'
  }
];
