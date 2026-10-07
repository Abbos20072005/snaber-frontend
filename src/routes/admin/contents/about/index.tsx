import { createFileRoute } from '@tanstack/react-router';

import { RichTextTabs } from '@/modules/about';
import { PageContent } from '@/shared/ui/page';

const RouteComponent = () => {
  return (
    <PageContent className='mx-auto w-full max-w-7xl'>
      <RichTextTabs />
    </PageContent>
  );
};

export const Route = createFileRoute('/admin/contents/about/')({
  component: RouteComponent
});
