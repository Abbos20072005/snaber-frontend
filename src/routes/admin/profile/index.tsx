import { createFileRoute } from '@tanstack/react-router';

import {
  DangerZoneSection,
  PasswordSection,
  ProfileSection,
  SettingsSidebar
} from '@/modules/profile';
import { PageContent } from '@/shared/ui/page';

const AdminProfilePage = () => {
  return (
    <PageContent className='px-4 py-4 sm:px-6'>
      <div className='mx-auto grid max-w-7xl gap-4 lg:grid-cols-[260px_minmax(0,1fr)]'>
        <SettingsSidebar className='mt-1 lg:sticky lg:top-0 lg:self-start' />
        <div className='no-scrollbar max-h-[calc(100dvh-7rem)] space-y-4 overflow-y-auto p-1'>
          <ProfileSection />
          <PasswordSection />
          <DangerZoneSection />
        </div>
      </div>
    </PageContent>
  );
};

export const Route = createFileRoute('/admin/profile/')({
  component: AdminProfilePage
});
