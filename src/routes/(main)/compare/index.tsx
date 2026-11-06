import { useLingui } from '@lingui/react/macro';
import { createFileRoute, Link } from '@tanstack/react-router';

import { Compare } from '@/modules/compare';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/shared/ui/breadcrumb';
import { SectionWrapper } from '@/shared/ui/section-wrapper';

const RouteComponent = () => {
  const { t } = useLingui();

  return (
    <SectionWrapper title={t`Compare`}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to='/'>{t`Home`}</Link>} />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{t`Compare`}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Compare />
    </SectionWrapper>
  );
};

export const Route = createFileRoute('/(main)/compare/')({
  component: RouteComponent
});
