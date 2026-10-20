import { createFileRoute } from '@tanstack/react-router';

import { LegalRichTextTabs } from '@/modules/legal';
import { PageContent } from '@/shared/ui/page';

const RouteComponent = () => {
  return (
    <PageContent className='mx-auto w-full max-w-7xl'>
      <LegalRichTextTabs />
    </PageContent>
  );
};

export const Route = createFileRoute('/admin/contents/legal/')({
  component: RouteComponent
});
