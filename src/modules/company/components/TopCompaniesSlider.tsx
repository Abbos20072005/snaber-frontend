import { useSuspenseQuery } from '@tanstack/react-query';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/shared/ui/carousel';

import { getAllTopCompaniesOptions } from '../options';
import { CompanyCard } from './CompanyCard';

export const TopCompaniesSlider = () => {
  const getAllTopCompanyQuery = useSuspenseQuery(
    getAllTopCompaniesOptions({ params: { is_popular: true } })
  );

  const companies = getAllTopCompanyQuery.data.results;

  return (
    <Carousel>
      <CarouselContent>
        {companies.map((item) => (
          <CarouselItem key={item.id} className='h-auto basis-80 xl:basis-1/4'>
            <CompanyCard company={item} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};
