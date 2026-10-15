import { useLingui } from '@lingui/react/macro';
import { Link } from '@tanstack/react-router';

import { links } from '@/routes/(main)/-components/Header/Header';
import { SiteLogo } from '@/routes/(main)/-components/SiteLogo';
import { Separator } from '@/shared/ui/separator';

// FEATURE DISABLED: Old B2B logo image (rebranded to snaber.uz text logo).
// import HImage from '../../../../public/images/HB2bImage.png';
import { contactsLabelMap } from './constants';

export const Footer = () => {
  const { t } = useLingui();
  const year = new Date().getFullYear();

  return (
    <footer className='mt-15 hidden border-t-4 border-yellow-400 bg-[#141414] text-white md:mt-20 md:block lg:mt-25'>
      <div className='container py-12 md:py-16'>
        <div className='grid gap-10 lg:grid-cols-[1.25fr_0.75fr_1fr] lg:gap-14'>
          <div className='space-y-5'>
            <Link className='inline-flex items-center gap-3' to='/'>
              {/* FEATURE DISABLED: Old B2B logo image. */}
              {/* <img alt={t`Logo`} className='size-full rounded-md object-contain' src={HImage} /> */}
              {/* FEATURE DISABLED: Old snaber.uz text logo (replaced by SiteLogo). */}
              {/* <span className='text-2xl font-extrabold tracking-tight text-white'> */}
              {/*   snaber<span className='text-cyan-300'>.uz</span> */}
              {/* </span> */}
              <SiteLogo dark />
            </Link>
            <p className='max-w-md text-sm leading-6 text-white/72'>
              {t`snaber.uz is a marketplace for building materials and tools — cement, bricks, steel, lumber, roofing, paints, plumbing, electrical goods and equipment from verified suppliers.`}
            </p>
          </div>

          <nav aria-label={t`Footer navigation`} className='space-y-4'>
            <p className='text-sm font-semibold tracking-[0.14em] text-yellow-400 uppercase'>
              {t`Navigation`}
            </p>
            <ul className='space-y-2'>
              {links.map((item) => (
                <li key={item.to}>
                  <Link
                    className='text-sm text-white/72 transition-colors hover:text-yellow-400'
                    to={item.to}
                  >
                    {t(item.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className='space-y-4'>
            <p className='text-sm font-semibold tracking-[0.14em] text-yellow-400 uppercase'>
              {t`Contact`}
            </p>
            <ul className='space-y-3'>
              {contactsLabelMap.map((item) => {
                const Icon = item.icon;

                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className='group flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-3 text-sm transition-colors hover:border-yellow-400/50 hover:bg-white/8'
                      rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                    >
                      <span className='mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-yellow-400 text-black'>
                        <Icon className='size-4' />
                      </span>
                      <span className='min-w-0'>
                        <span className='block text-xs text-white/48'>{t(item.label)}</span>
                        <span className='block wrap-break-word text-white/82 group-hover:text-white'>
                          {item.value}
                        </span>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <Separator className='my-8 bg-white/12' />

        <div className='flex flex-col justify-between gap-3 text-sm text-white/60 md:flex-row md:items-center'>
          <p className='max-w-xl'>{t`Copyright ${year} snaber.uz. Building materials and tools marketplace.`}</p>
          <span className='font-semibold text-white md:text-lg lg:text-2xl'>
            Buildex System
          </span>
        </div>
      </div>
    </footer>
  );
};
