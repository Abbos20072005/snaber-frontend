import { useLingui } from '@lingui/react/macro';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Suspense } from 'react';

import { ContactSection } from '@/modules/contact';
import { Faqs, FaqsSkeleton, getFaqsOptions } from '@/modules/faqs';
import { getLocale } from '@/shared/i18n';
import { createSeoMeta, DEFAULT_OG_IMAGE } from '@/shared/lib/seo';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/shared/ui/breadcrumb';
import { GeneralError, NotFoundError } from '@/shared/ui/errors';
import { PageLoading } from '@/shared/ui/page';
import { SectionWrapper } from '@/shared/ui/section-wrapper';

const RouteComponent = () => {
  const { t } = useLingui();

  useSuspenseQuery(getFaqsOptions());

  return (
    <>
      <SectionWrapper className='max-w-5xl' title={t`Service and support`}>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link to='/'>{t`Home`}</Link>} />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t`Service and support`}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </SectionWrapper>

      <SectionWrapper title={t`FAQs`} titleCenter={true}>
        <Suspense fallback={<FaqsSkeleton />}>
          <Faqs />
        </Suspense>
      </SectionWrapper>

      <ContactSection />
    </>
  );
};

export const Route = createFileRoute('/(main)/support/')({
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(getFaqsOptions()),
  component: RouteComponent,
  pendingComponent: PageLoading,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
  head: ({ match }) => {
    const siteUrl = import.meta.env.VITE_SITE_URL || '';

    return createSeoMeta({
      title: 'Service and support',
      description:
        'Support service of snaber.uz: answers to frequently asked questions and a contact form for our specialists.',
      url: siteUrl ? `${siteUrl}${match.pathname}` : undefined,
      locale: getLocale(),
      image: siteUrl ? `${siteUrl}${DEFAULT_OG_IMAGE.url}` : DEFAULT_OG_IMAGE.url,
      imageWidth: DEFAULT_OG_IMAGE.width,
      imageHeight: DEFAULT_OG_IMAGE.height
    });
  }
});
