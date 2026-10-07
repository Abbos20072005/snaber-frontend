import { useLingui } from '@lingui/react/macro';
import { Settings2Icon, XIcon } from 'lucide-react';
import { parseAsArrayOf, parseAsInteger, parseAsStringLiteral, useQueryState } from 'nuqs';
import { useState } from 'react';

import {
  CompanyBadgeSelect,
  CompanyIndustryCombobox,
  CompanyRegionsCombobox,
  CompanySortSelect
} from '@/modules/company';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/shared/ui/drawer';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';

export const CompanyFilterSection = () => {
  const { t } = useLingui();
  const [open, setOpen] = useState(false);
  const [industry, setIndustry] = useQueryState(
    'industry',
    parseAsArrayOf(parseAsInteger).withDefault([])
  );
  const [region, setRegion] = useQueryState('region', parseAsInteger);
  const [sort, setSort] = useQueryState(
    'sort',
    parseAsStringLiteral<SortType>(['new', 'most_ordered', 'old', 'most_products'])
  );
  const [badge, setBadge] = useQueryState(
    'product_type',
    parseAsStringLiteral<ProductType>(['both', 'made_to_order', 'ready'])
  );

  const activeFiltersCount = [industry.length > 0, region, badge, sort].filter(Boolean).length;
  const isClear = activeFiltersCount > 0;

  const handleClear = () => {
    void setBadge(null);
    void setIndustry(null);
    void setRegion(null);
    void setSort(null);
    setOpen(false);
  };

  return (
    <>
      <div className='block md:hidden'>
        <Drawer>
          <DrawerTrigger
            render={
              <div className='relative'>
                <Button size='sm' variant='outline'>
                  <Settings2Icon className='size-4' />
                </Button>
                {isClear && (
                  <div className='bg-primary absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full'>
                    <span className='text-primary-foreground text-[10px] leading-none font-bold'>
                      {activeFiltersCount}
                    </span>
                  </div>
                )}
              </div>
            }
          />
          <DrawerContent>
            <div className='mx-auto w-full max-w-sm'>
              <DrawerHeader>
                <DrawerTitle>{t`Company Filters`}</DrawerTitle>
              </DrawerHeader>
              <div className='flex flex-col gap-4 p-4'>
                <CompanyIndustryCombobox
                  value={industry.map((value) => ({ label: '', value: String(value) }))}
                  onValueChange={(options) =>
                    setIndustry(options.map((option) => Number(option.value)))
                  }
                />
                <CompanyRegionsCombobox
                  value={region ? { label: '', value: String(region) } : null}
                  onValueChange={(option) => setRegion(option ? Number(option.value) : null)}
                />
                <CompanyBadgeSelect badge={badge} onBadgeChange={setBadge} />
                <CompanySortSelect setSort={setSort} sort={sort} />
                <div className='flex items-center justify-between'>
                  <DrawerClose
                    render={
                      <Button className={cn(!isClear && 'w-full')} variant='outline'>
                        {t`Close`}
                      </Button>
                    }
                  />
                  {isClear && (
                    <Button className='' variant='destructiveLight' onClick={handleClear}>
                      <XIcon /> {t`Reset`}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
      <div className='hidden md:block'>
        <Popover onOpenChange={setOpen} open={open}>
          <PopoverTrigger
            render={
              <div className='relative'>
                <Button size='sm' variant='outline' onClick={() => setOpen(true)}>
                  <Settings2Icon className='size-4' />
                </Button>
                {isClear && (
                  <div className='bg-primary absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full'>
                    <span className='text-primary-foreground text-[10px] leading-none font-bold'>
                      {activeFiltersCount}
                    </span>
                  </div>
                )}
              </div>
            }
          />
          <PopoverContent align='end' className='mt-2 w-80'>
            <div className='flex flex-col gap-4'>
              <CompanyIndustryCombobox
                value={industry.map((value) => ({ label: '', value: String(value) }))}
                onValueChange={(options) =>
                  setIndustry(options.map((option) => Number(option.value)))
                }
              />
              <CompanyRegionsCombobox
                value={region ? { label: '', value: String(region) } : null}
                onValueChange={(option) => setRegion(option ? Number(option.value) : null)}
              />
              <CompanyBadgeSelect badge={badge} onBadgeChange={setBadge} />
              <CompanySortSelect setSort={setSort} sort={sort} />
              <div className='flex items-center justify-between'>
                <Button
                  className={cn(!isClear && 'w-full')}
                  variant='outline'
                  onClick={() => setOpen(false)}
                >
                  {t`Close`}
                </Button>
                {isClear && (
                  <Button variant='destructiveLight' onClick={handleClear}>
                    <XIcon /> {t`Reset`}
                  </Button>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};
