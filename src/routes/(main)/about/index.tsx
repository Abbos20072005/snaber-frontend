import { useLingui } from '@lingui/react/macro';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';

import { BackendContent, getAboutInfoOptions } from '@/modules/about';
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

  const aboutInfoQuery = useSuspenseQuery(getAboutInfoOptions());
  const about = aboutInfoQuery.data;

  return (
    <SectionWrapper className='max-w-5xl' title={t`About Us`} titleCenter={true}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to='/'>{t`Home`}</Link>} />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{t`About Us`}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <BackendContent html={about.information} />
    </SectionWrapper>
  );
};

export const Route = createFileRoute('/(main)/about/')({
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(getAboutInfoOptions()),
  head: ({ loaderData, match }) => {
    const siteUrl = import.meta.env.VITE_SITE_URL || '';
    const canonicalUrl = siteUrl ? `${siteUrl}${match.pathname}` : undefined;

    return {
      ...createSeoMeta({
        title: 'About Us',
        description:
          loaderData?.information ||
          'Learn about B2B, our marketplace, and how we connect businesses with suppliers and products.',
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
