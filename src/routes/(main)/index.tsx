import { t } from '@lingui/core/macro';
// FEATURE DISABLED: Top products section on the home page.
// import { useLingui } from '@lingui/react/macro';
import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';

import {
  getPublicAllCategoriesOptions,
  TopCategoriesSection,
  TopCategoriesSkeleton
} from '@/modules/category';
// FEATURE DISABLED: Top companies section on the home page.
// import { CompanyCardSkeleton, TopCompaniesSlider } from '@/modules/company';
// FEATURE DISABLED: FAQs section.
// import { Faqs, FaqsSkeleton } from '@/modules/faqs';
// FEATURE DISABLED: Top products section on the home page.
// import { ProductListSkeleton } from '@/modules/products';
import { getLocale } from '@/shared/i18n';
import { createSeoMeta, DEFAULT_OG_IMAGE } from '@/shared/lib/seo';
import { GeneralError, NotFoundError } from '@/shared/ui/errors';
import { SectionWrapper } from '@/shared/ui/section-wrapper.tsx';

// FEATURE DISABLED: Top products section on the home page.
// import { TopProductsList } from './-components';
// FEATURE DISABLED: Hero banner on the home page.
// import { HeroSection } from './-components';

const HomePending = () => (
  <SectionWrapper className='pt-4 lg:pt-5'>
    <TopCategoriesSkeleton />
  </SectionWrapper>
);

const App = () => {
  return (
    <>
      {/* FEATURE DISABLED: Hero banner on the home page. */}
      {/* <HeroSection /> */}
      <SectionWrapper className='pt-4 lg:pt-5'>
        <Suspense fallback={<TopCategoriesSkeleton />}>
          <TopCategoriesSection />
        </Suspense>
      </SectionWrapper>
      {/* FEATURE DISABLED: Top products section on the home page. */}
      {/* <SectionWrapper search={{ is_popular: 'true' }} title={t`Top products`} to='/products'> */}
      {/*   <Suspense fallback={<ProductListSkeleton view='grid' />}> */}
      {/*     <TopProductsList /> */}
      {/*   </Suspense> */}
      {/* </SectionWrapper> */}
      {/* FEATURE DISABLED: Top companies section on the home page. */}
      {/* <SectionWrapper title={t`Top companies`} to='/companies'> */}
      {/*   <Suspense */}
      {/*     fallback={ */}
      {/*       <div className='-ml-4 flex overflow-hidden'> */}
      {/*         {Array.from({ length: 10 }).map((_, index) => ( */}
      {/*           <div key={index} className='shrink-0 basis-80 pl-4'> */}
      {/*             <CompanyCardSkeleton /> */}
      {/*           </div> */}
      {/*         ))} */}
      {/*       </div> */}
      {/*     } */}
      {/*   > */}
      {/*     <TopCompaniesSlider /> */}
      {/*   </Suspense> */}
      {/* </SectionWrapper> */}
      {/* FEATURE DISABLED: FAQs section. */}
      {/* <SectionWrapper title={t`FAQs`} titleCenter={true}> */}
      {/*   <Suspense fallback={<FaqsSkeleton />}> */}
      {/*     <Faqs /> */}
      {/*   </Suspense> */}
      {/* </SectionWrapper> */}
    </>
  );
};

export const Route = createFileRoute('/(main)/')({
  // Categories are loaded on the server so the first paint already has them instead of a skeleton.
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(getPublicAllCategoriesOptions()),
  component: App,
  pendingComponent: HomePending,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
  head: ({ match }) => {
    const siteUrl = import.meta.env.VITE_SITE_URL || '';

    return createSeoMeta({
      title: t`Home`,
      description: t`snaber.uz — building materials and tools: cement, bricks, steel, lumber, roofing, paints and equipment from verified suppliers.`,
      url: siteUrl ? `${siteUrl}${match.pathname}` : undefined,
      locale: getLocale(),
      image: siteUrl ? `${siteUrl}${DEFAULT_OG_IMAGE.url}` : DEFAULT_OG_IMAGE.url,
      imageWidth: DEFAULT_OG_IMAGE.width,
      imageHeight: DEFAULT_OG_IMAGE.height
    });
  }
});
