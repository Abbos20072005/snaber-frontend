import { useLingui } from '@lingui/react/macro';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeftIcon, SettingsIcon } from 'lucide-react';

import { DangerZoneSection, ProfileSection } from '@/modules/profile';
import { GeneralError, NotFoundError } from '@/shared/ui/errors';
import { PageLoading } from '@/shared/ui/page';
import { SectionWrapper } from '@/shared/ui/section-wrapper';

const SettingsPage = () => {
  const { t } = useLingui();

  return (
    <>
      <SectionWrapper
        className='md:hidden'
        content={
          <>
            <h2 className='text-primary flex items-center gap-1.5 text-xl font-bold'>
              <Link className='flex items-center gap-1 text-xs md:text-base' to='/profile'>
                <ArrowLeftIcon className='size-4' />
              </Link>
              <SettingsIcon className='size-5' />
              {t`Settings`}
            </h2>
          </>
        }
      >
        <section className='space-y-4'>
          <ProfileSection />
          <DangerZoneSection />
        </section>
      </SectionWrapper>
      <div className='hidden md:block'>
        <section className='space-y-4'>
          <ProfileSection />
          <DangerZoneSection />
        </section>
      </div>
    </>
  );
};

export const Route = createFileRoute('/(main)/profile/settings')({
  component: SettingsPage,
  pendingComponent: PageLoading,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError
});
