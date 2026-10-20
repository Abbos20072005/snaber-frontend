import { useLingui } from '@lingui/react/macro';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';

import { BackendContent } from '@/modules/about';
import { getLegalInfoOptions } from '@/modules/legal';
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

  const legalInfoQuery = useSuspenseQuery(getLegalInfoOptions());
  const legal = legalInfoQuery.data;

  return (
    <SectionWrapper className='max-w-5xl' title={t`For legal clients`} titleCenter={true}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to='/'>{t`Home`}</Link>} />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{t`For legal clients`}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <BackendContent html={legal.information} />
    </SectionWrapper>
  );
};

export const Route = createFileRoute('/(main)/legal/')({
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(getLegalInfoOptions()),
  head: ({ match }) => {
    const siteUrl = import.meta.env.VITE_SITE_URL || '';
    const canonicalUrl = siteUrl ? `${siteUrl}${match.pathname}` : undefined;

    return {
      ...createSeoMeta({
        title: 'For legal clients',
        description:
          'snaber.uz for legal clients: terms of cooperation, documents and payment for companies.',
        url: canonicalUrl,
        locale: getLocale(),
        image: siteUrl ? `${siteUrl}${DEFAULT_OG_IMAGE.url}` : DEFAULT_OG_IMAGE.url,
        imageWidth: DEFAULT_OG_IMAGE.width,
        imageHeight: DEFAULT_OG_IMAGE.height
      })
    };
  },
  component: RouteComponent,
  pendingComponent: PageLoading,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError
});
