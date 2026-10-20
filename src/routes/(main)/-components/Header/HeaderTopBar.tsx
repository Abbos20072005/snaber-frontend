import { useLingui } from '@lingui/react/macro';
import { Link } from '@tanstack/react-router';
import { MapPinIcon, PhoneIcon } from 'lucide-react';

import { headerLinks } from './constants';

export const HeaderTopBar = () => {
  const { t } = useLingui();

  return (
    <div className='border-border/60 bg-muted/40 hidden border-b md:block'>
      <div className='container flex h-8 items-center justify-between gap-6'>
        <span className='text-muted-foreground flex items-center gap-1.5 text-xs font-medium'>
          <MapPinIcon className='size-3.5' />
          {t`Tashkent`}
        </span>

        <nav className='hidden items-center gap-5 lg:flex'>
          {headerLinks.map((item) => (
            <Link
              key={item.to}
              className='text-foreground/80 hover:text-foreground text-xs font-medium transition-colors hover:underline'
              to={item.to}
            >
              {t(item.label)}
            </Link>
          ))}
        </nav>

        <a
          href='tel:+998712037772'
          className='text-foreground/80 hover:text-foreground flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap transition-colors hover:underline'
        >
          <PhoneIcon className='size-3.5' />
          +998 71 203 77 72
        </a>
      </div>
    </div>
  );
};
