import type { MessageDescriptor } from '@lingui/core';
import type { LinkProps } from '@tanstack/react-router';

import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react/macro';
import { Link } from '@tanstack/react-router';
import { MapPinIcon, PhoneIcon } from 'lucide-react';

export const topBarLinks: { label: MessageDescriptor; to: LinkProps['to'] }[] = [
  { label: msg`Delivery and payment`, to: '/delivery' },
  { label: msg`Service and support`, to: '/support' },
  { label: msg`About us`, to: '/about' }
];

export const HeaderTopBar = () => {
  const { t } = useLingui();

  return (
    <div className='border-border/60 bg-muted/40 hidden border-b md:block'>
      <div className='container flex h-10 items-center justify-between gap-6'>
        <span className='text-muted-foreground flex items-center gap-1.5 text-sm font-medium'>
          <MapPinIcon className='size-4' />
          {t`Tashkent`}
        </span>

        <nav className='hidden items-center gap-6 lg:flex'>
          {topBarLinks.map((item) => (
            <Link
              key={item.to}
              className='text-foreground/80 hover:text-foreground text-sm font-medium transition-colors hover:underline'
              to={item.to}
            >
              {t(item.label)}
            </Link>
          ))}
        </nav>

        <a
          href='tel:+998712037772'
          className='text-foreground/80 hover:text-foreground flex items-center gap-1.5 text-sm font-semibold whitespace-nowrap transition-colors hover:underline'
        >
          <PhoneIcon className='size-4' />
          +998 71 203 77 72
        </a>
      </div>
    </div>
  );
};
