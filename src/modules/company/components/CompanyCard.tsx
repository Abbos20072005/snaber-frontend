import { useLingui } from '@lingui/react/macro';
import { Link } from '@tanstack/react-router';
import { EyeIcon, MapPinIcon } from 'lucide-react';

import { generateSlugId } from '@/shared/constants';
import { useFormatCount } from '@/shared/lib/format.ts';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/badge';
import { Button, buttonVariants } from '@/shared/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';

import { CompanyIndustryPopover } from './CompanyIndustryPopover.tsx';
import { CompanyPopover } from './CompanyPopover';

interface Props {
  company: Company;
}

export const CompanyCard = ({ company }: Props) => {
  const { t } = useLingui();
  const formatCount = useFormatCount();

  return (
    <Card className='relative flex h-full flex-col items-stretch' size='sm'>
      <div className='absolute right-2 flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-white backdrop-blur-sm'>
        <EyeIcon className='size-3' />
        <span className='text-xs font-medium'>{formatCount(company.view_count)}</span>
      </div>
      <CardHeader>
        <div className='mb-1 flex gap-2'>
          <img
            alt={t`Company logo`}
            className='size-12 rounded-xl object-cover'
            src={company.logo}
          />
          <div className='flex-1 space-y-1'>
            <CardTitle>{company.name}</CardTitle>
            <div className='flex items-center gap-1 text-xs'>
              <MapPinIcon size={14} /> <p>{company.region.name}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className='space-y-3'>
        <div className='flex flex-wrap gap-2'>
          {company.industries.length > 3
            ? company.industries.slice(0, 3).map((item) => (
                <Badge key={item.id} variant={'secondary'}>
                  {item.name}
                </Badge>
              ))
            : company.industries.map((item) => (
                <Badge
                  key={item.id}
                  className='flex items-center justify-center'
                  variant={'secondary'}
                >
                  {item.name}
                </Badge>
              ))}
          {company.industries.length > 3 && (
            <CompanyIndustryPopover industries={company.industries.slice(3)} />
          )}
        </div>
        <Separator />
        <div className='grid grid-cols-2 gap-3'>
          <div className='w-full'>
            <h4 className='text-primary font-semibold'>{t`Order count`}</h4>
            <p className='text-muted-foreground'>{company.order_counts}</p>
          </div>
          <div className='w-full'>
            <h4 className='text-primary font-semibold'>{t`Employees`}</h4>
            <p className='text-muted-foreground'>{company.member_counts}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className='flex-1 flex-col justify-end gap-2'>
        <Link
          className={cn('w-full', buttonVariants({ variant: 'outline' }))}
          params={{ slug: generateSlugId(company.id, company.name) }}
          to='/companies/$slug'
        >
          {t`View Profile`}
        </Link>
        <CompanyPopover socialLinks={company.contacts}>
          <Button className='w-full'>{t`Contact`}</Button>
        </CompanyPopover>
      </CardFooter>
    </Card>
  );
};
