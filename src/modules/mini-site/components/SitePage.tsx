import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react/macro';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, useParams } from '@tanstack/react-router';
import { EyeIcon } from 'lucide-react';
import { parseAsString, useQueryState } from 'nuqs';
import { Activity } from 'react';

import { getPublicCompanyByIdOptions } from '@/modules/company';
import {
  CertificatesSection,
  FactoryPhotosSection,
  OverviewSection,
  ProductsSection,
  RightSidebar
} from '@/modules/mini-site';
import { extractSlugId } from '@/shared/constants';
import { useFormatCount } from '@/shared/lib/format.ts';
import { cn } from '@/shared/lib/utils';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/shared/ui/breadcrumb';
import { Button } from '@/shared/ui/button';
import { SectionWrapper } from '@/shared/ui/section-wrapper';

const tabs = [
  { key: 'overview', label: msg`Overview` },
  { key: 'products', label: msg`Products` },
  { key: 'photos', label: msg`Gallery` }
];

export const SitePage = () => {
  const { t } = useLingui();
  const { slug } = useParams({ from: '/(main)/companies/$slug' });
  const [activeTab, setActiveTab] = useQueryState('tab', parseAsString.withDefault('overview'));

  const id = extractSlugId(slug);

  const miniSiteSuspenseQuery = useSuspenseQuery(getPublicCompanyByIdOptions({ id }));
  const miniSite = miniSiteSuspenseQuery.data;

  const formatCount = useFormatCount();

  return (
    <SectionWrapper className='text-primary min-h-screen' title={miniSite.name}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to='/'>{t`Home`}</Link>} />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to='/companies'>{t`Companies`}</Link>} />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{miniSite.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <section className='ring-muted mt-3 rounded-2xl bg-white p-3 shadow-sm ring-1 sm:p-4'>
        <div className='relative overflow-hidden rounded-2xl'>
          {miniSite.cover ? (
            miniSite.cover.type === 'image' ? (
              <img
                alt={miniSite.name}
                className='h-36 w-full object-cover sm:h-52'
                src={miniSite.cover?.url}
              />
            ) : (
              <video
                muted
                className='h-36 w-full object-cover sm:h-52'
                src={miniSite.cover?.url}
                autoPlay
                loop
              />
            )
          ) : (
            <div className='h-36 bg-[linear-gradient(120deg,#193150_0%,#4f647f_35%,var(--primary)_55%,#697c96_78%,#1b2d44_100%)] sm:h-52' />
          )}
        </div>
        <div className='flex items-center justify-between'>
          <div className='-mt-8.5 flex flex-wrap items-end justify-between gap-3'>
            <div className='flex items-end gap-3'>
              <div className='z-1 size-22 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-slate-200'>
                <img
                  alt={`${miniSite.name} logo`}
                  className='size-full rounded-xl object-cover'
                  src={miniSite.logo ?? '/favicon.ico'}
                />
              </div>
              <div className='mt-10 pb-0.5 md:mt-0'>
                <h2 className='text-primary text-lg font-semibold'>{miniSite.name}</h2>
                <p className='text-muted-foreground mt-0.5 text-xs'>
                  {[miniSite.region.name, miniSite.address].filter(Boolean).join(' - ')}
                </p>
              </div>
            </div>
          </div>
          <div className='mt-1 flex w-fit items-center gap-1 self-start rounded-full bg-black/50 px-2 py-1 text-white backdrop-blur-sm'>
            <EyeIcon className='size-3' />
            <span className='text-xs font-medium'>{formatCount(miniSite.view_count)}</span>
          </div>
        </div>
        <div className='mt-4 flex flex-wrap items-center gap-1 border-b border-slate-200'>
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab;

            return (
              <Button
                key={tab.key}
                className={cn(
                  'rounded-b-none! border-b-2 px-3 py-2 text-xs font-medium transition',
                  isActive
                    ? 'border-b-primary text-primary border'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                )}
                type='button'
                variant='ghost'
                onClick={() => setActiveTab(tab.key)}
              >
                {t(tab.label)}
              </Button>
            );
          })}
        </div>
      </section>
      <section className='mt-4'>
        <Activity name='mini-site-overview' mode={activeTab === 'overview' ? 'visible' : 'hidden'}>
          <div className='grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]'>
            <div className='space-y-4'>
              <OverviewSection miniSite={miniSite} />
              <CertificatesSection certificates={miniSite.certificates} />
            </div>
            <RightSidebar className='lg:sticky lg:top-4 lg:self-start' miniSite={miniSite} />
          </div>
        </Activity>
        <Activity name='mini-site-products' mode={activeTab === 'products' ? 'visible' : 'hidden'}>
          <ProductsSection />
        </Activity>
        <Activity name='mini-site-photos' mode={activeTab === 'photos' ? 'visible' : 'hidden'}>
          <div className='grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]'>
            <FactoryPhotosSection gallery={miniSite.gallery} />
            <RightSidebar className='lg:sticky lg:top-4 lg:self-start' miniSite={miniSite} />
          </div>
        </Activity>
      </section>
    </SectionWrapper>
  );
};
