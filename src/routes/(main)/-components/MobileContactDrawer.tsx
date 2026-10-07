import { useLingui } from '@lingui/react/macro';
import { ChevronRightIcon, HeadsetIcon } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger
} from '@/shared/ui/drawer';

import { contactsLabelMap } from './constants';

export const MobileContactDrawer = () => {
  const { t } = useLingui();

  return (
    <Drawer>
      <DrawerTrigger className='text-muted-foreground hover:text-foreground flex w-full shrink-0 items-center justify-between border-b py-3 text-sm whitespace-nowrap transition-colors'>
        <div className='flex items-center justify-start gap-2'>
          <HeadsetIcon className='size-4' />
          {t`Contact`}
        </div>
        <ChevronRightIcon />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <ul className='space-y-3'>
            {contactsLabelMap.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className='group flex items-start gap-3 rounded-lg border p-3 text-sm'
                    rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                  >
                    <span className='bg-primary mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md text-white'>
                      <Icon className='size-4' />
                    </span>
                    <span className='min-w-0'>
                      <span className='block text-start text-xs'>{t(item.label)}</span>
                      <span className='block text-sm wrap-break-word'>{item.value}</span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose>
            <Button className='w-full' variant='outline'>
              {t`Close`}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
