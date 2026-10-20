import { useLingui } from '@lingui/react/macro';
import { Link } from '@tanstack/react-router';
import { ArrowRightIcon } from 'lucide-react';
// FEATURE DISABLED: Hero statistics (company statistics endpoint is disabled).
// import NumberFlow from '@number-flow/react';
// import { useQuery } from '@tanstack/react-query';
// import { useEffect, useState } from 'react';

// import { getMainStatisticsOptions } from '@/modules/statistics';
import { cn } from '@/shared/lib/utils';
import { buttonVariants } from '@/shared/ui/button';

// FEATURE DISABLED: Hero statistics (company statistics endpoint is disabled).
// const StatItem = ({ label, numericValue }: { label: string; numericValue: number }) => {
//   const [value, setValue] = useState(0);

//   useEffect(() => {
//     setValue(numericValue);
//   }, [numericValue]);

//   return (
//     <div className='items-center justify-center border-white/14 py-5 sm:border-r sm:px-6 first:sm:pl-0 last:sm:border-r-0'>
//       <NumberFlow
//         className='text-2xl font-semibold tracking-tight'
//         value={value}
//         format={{ notation: 'compact', compactDisplay: 'short' }}
//       />
//       <p className='mt-1 text-xs font-medium tracking-[0.16em] text-cyan-100/80 uppercase'>
//         {label}
//       </p>
//     </div>
//   );
// };

export const HeroSection = () => {
  const { t } = useLingui();

  // FEATURE DISABLED: Hero statistics (company statistics endpoint is disabled).
  // const getMainStatisticsQuery = useQuery(getMainStatisticsOptions());
  // const mainStatistics = getMainStatisticsQuery.data?.data;

  return (
    <section className='relative isolate min-h-[calc(100vh-64px)] overflow-hidden bg-slate-950'>
      <img
        alt={t`Industrial B2B marketplace operations background`}
        className='absolute inset-0 size-full object-cover object-center'
        src='/images/hero/industrial-marketplace-hero.png'
      />
      <div className='absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.96)_0%,rgba(15,23,42,0.84)_38%,rgba(15,23,42,0.36)_72%,rgba(15,23,42,0.16)_100%)]' />
      <div className='absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-slate-950 to-transparent' />
      <div className='relative container flex min-h-[calc(100vh-80px)] flex-col justify-center py-18 sm:py-22 lg:py-28'>
        <div className='max-w-3xl'>
          <p className='mb-6 inline-flex w-fit border-l-2 border-cyan-300 bg-white/8 px-3 py-1.5 text-[10px] font-semibold tracking-[0.2em] text-cyan-100 uppercase backdrop-blur-md'>
            {t`Verified industrial marketplace`}
          </p>
          <h1 className='text-4xl leading-[1.03] font-semibold tracking-tight text-white sm:text-5xl lg:text-7xl'>
            {t`Procurement built for national-scale production.`}
          </h1>
          <p className='mt-6 max-w-2xl text-base leading-8 text-slate-200/88 sm:text-lg'>
            {t`Connect verified manufacturers, supplier catalogs, and institutional purchasing in one operational B2B market system.`}
          </p>
          <div className='mt-9 flex flex-wrap items-center gap-3'>
            <Link className={buttonVariants({ size: 'lg' })} to='/products'>
              {t`Start procurement`}
              <ArrowRightIcon />
            </Link>
            <Link
              className={cn(
                buttonVariants({ size: 'lg', variant: 'outline' }),
                'border-white/25 bg-white/10 text-white backdrop-blur-md hover:bg-white/18 hover:text-white'
              )}
              to='/catalog'
            >
              {t`Explore catalog`}
            </Link>
          </div>
        </div>

        {/* FEATURE DISABLED: Hero statistics (company statistics endpoint is disabled). */}
        {/* <div className='mt-14 grid max-w-4xl grid-cols-1 border-y border-white/14 text-white sm:grid-cols-3'> */}
        {/*   <StatItem label={t`Registered entities`} numericValue={mainStatistics?.companies ?? 0} /> */}
        {/*   <StatItem label={t`Total product`} numericValue={mainStatistics?.products ?? 0} /> */}
        {/*   <StatItem label={t`Total users`} numericValue={mainStatistics?.users ?? 0} /> */}
        {/* </div> */}
      </div>
    </section>
  );
};
