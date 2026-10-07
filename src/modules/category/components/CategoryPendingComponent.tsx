import { useLingui } from '@lingui/react/macro';

import { SectionWrapper } from '@/shared/ui/section-wrapper';

import { CategorySkeleton } from './CategorySkeleton';

export const CategoryPendingComponent = () => {
  const { t } = useLingui();
  return (
    <div>
      <SectionWrapper title={t`Catalogs`}>
        <div className='grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-2 md:grid-cols-[repeat(auto-fill,minmax(230px,1fr))] md:gap-4'>
          <CategorySkeleton />
          <CategorySkeleton />
          <CategorySkeleton />
          <CategorySkeleton />
          <CategorySkeleton />
          <CategorySkeleton />
          <CategorySkeleton />
          <CategorySkeleton />
          <CategorySkeleton />
          <CategorySkeleton />
          <CategorySkeleton />
          <CategorySkeleton />
        </div>
      </SectionWrapper>
    </div>
  );
};
