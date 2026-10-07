import { Settings2Icon } from 'lucide-react';

import { MiniSiteFilterSection } from '@/modules/filter';
import { Button } from '@/shared/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/shared/ui/drawer';

import type { MiniSiteFilterCategory } from './MiniSiteFilterSection';

import { FilterSection } from './FilterSection';

interface Props {
  category?: number | string;
  miniSiteCategories?: MiniSiteFilterCategory[];
}

export const MobileFilter = ({ category, miniSiteCategories }: Props) => {
  return (
    <div className='relative md:hidden'>
      <Drawer modal={false}>
        <DrawerTrigger
          render={
            <Button size='sm' variant='outline'>
              <Settings2Icon className='size-4' />
            </Button>
          }
        />
        <DrawerContent>
          {miniSiteCategories ? (
            <MiniSiteFilterSection
              className='max-h-[80svh] overflow-y-auto border-none bg-none shadow-none ring-transparent'
              categories={miniSiteCategories}
              category={category}
            />
          ) : (
            <FilterSection
              className='max-h-[80svh] overflow-y-auto border-none bg-none shadow-none ring-transparent'
              category={category}
            />
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
};
