import { useLingui } from '@lingui/react/macro';
import { FactoryIcon, ScanSearchIcon, WarehouseIcon } from 'lucide-react';

import useFancybox from '@/shared/hooks/useFancybox';
import { cn } from '@/shared/lib/utils';

const icons = [FactoryIcon, ScanSearchIcon, WarehouseIcon];

interface Props {
  gallery: Gallery[];
}

export const FactoryPhotosSection = ({ gallery }: Props) => {
  const { t } = useLingui();
  const { fancyboxRef } = useFancybox();

  return (
    <section className='space-y-4'>
      <article className='ring-muted rounded-2xl bg-white p-5 shadow-sm ring-1'>
        <h2 className='text-primary text-lg font-semibold'>{t`Company images`}</h2>
        <div ref={fancyboxRef} className='mt-4 grid grid-cols-4 gap-3'>
          {gallery.map((tile, index) => {
            const Icon = icons[index % icons.length];

            return (
              <figure
                key={tile.title}
                className={cn(
                  'group relative min-h-44 overflow-hidden rounded-xl transition-all duration-200 hover:scale-102',
                  gallery.length % 2 === 1
                    ? index === 0 && 'sm:col-span-2'
                    : (index === 0 || index === gallery.length - 1) && 'sm:col-span-2'
                )}
              >
                {tile.image ? (
                  <a
                    href={tile.image}
                    aria-label={tile.title}
                    className='block size-full'
                    data-caption={tile.title}
                    data-fancybox='factory-photos'
                  >
                    <img
                      alt={tile.title}
                      className='absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105'
                      src={tile.image}
                    />
                  </a>
                ) : (
                  <div className='absolute inset-0 bg-[linear-gradient(120deg,#8ea8cb_0%,#577195_46%,#2c3e58_100%)]' />
                )}
                <div className='pointer-events-none absolute top-3 right-3 inline-flex size-7 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm'>
                  <Icon className='size-3.5' />
                </div>
                <figcaption className='pointer-events-none absolute right-3 bottom-3 left-3 text-sm font-semibold text-white'>
                  {tile.title}
                </figcaption>
              </figure>
            );
          })}
          {gallery.length === 0 && (
            <p className='text-muted-foreground text-sm'>{t`Factory photos not found`}</p>
          )}
        </div>
      </article>
    </section>
  );
};
