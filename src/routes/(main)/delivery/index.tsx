import { useLingui } from '@lingui/react/macro';
import { createFileRoute, Link } from '@tanstack/react-router';
import { BanknoteIcon, PackageCheckIcon, TruckIcon } from 'lucide-react';

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
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { GeneralError, NotFoundError } from '@/shared/ui/errors';
import { PageLoading } from '@/shared/ui/page';
import { SectionWrapper } from '@/shared/ui/section-wrapper';

const RouteComponent = () => {
  const { t } = useLingui();

  return (
    <SectionWrapper
      className='max-w-5xl'
      title={t`Delivery and payment`}
      description={t`How SNABER delivers and accepts payment for building materials and tools.`}
    >
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to='/'>{t`Home`}</Link>} />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{t`Delivery and payment`}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className='grid gap-4 md:grid-cols-3'>
        <Card>
          <CardHeader>
            <TruckIcon className='text-primary size-6' />
            <CardTitle>{t`Delivery`}</CardTitle>
          </CardHeader>
          <CardContent className='text-muted-foreground space-y-2 text-sm'>
            <p>{t`Delivery to Tashkent is carried out by our own transport.`}</p>
            <p>{t`Delivery to other regions is available for orders above a certain amount.`}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <PackageCheckIcon className='text-primary size-6' />
            <CardTitle>{t`Pickup from warehouse`}</CardTitle>
          </CardHeader>
          <CardContent className='text-muted-foreground space-y-2 text-sm'>
            <p>{t`You can pick up the order yourself from our warehouse in Tashkent.`}</p>
            <p>{t`The pickup address is available to the manager after the order is confirmed.`}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <BanknoteIcon className='text-primary size-6' />
            <CardTitle>{t`Payment`}</CardTitle>
          </CardHeader>
          <CardContent className='text-muted-foreground space-y-2 text-sm'>
            <p>{t`Payment in cash or by bank transfer for legal entities.`}</p>
            <p>{t`All prices on the site are indicated in UZS.`}</p>
          </CardContent>
        </Card>
      </div>
    </SectionWrapper>
  );
};

export const Route = createFileRoute('/(main)/delivery/')({
  component: RouteComponent,
  pendingComponent: PageLoading,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
  head: ({ match }) => {
    const siteUrl = import.meta.env.VITE_SITE_URL || '';

    return createSeoMeta({
      title: 'Delivery and payment',
      description:
        'Delivery and payment conditions on snaber.uz: delivery in Tashkent, pickup from the warehouse and payment in UZS.',
      url: siteUrl ? `${siteUrl}${match.pathname}` : undefined,
      locale: getLocale(),
      image: siteUrl ? `${siteUrl}${DEFAULT_OG_IMAGE.url}` : DEFAULT_OG_IMAGE.url,
      imageWidth: DEFAULT_OG_IMAGE.width,
      imageHeight: DEFAULT_OG_IMAGE.height
    });
  }
});
