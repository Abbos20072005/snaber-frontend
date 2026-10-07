'use client';
import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer';
import * as React from 'react';

import { cn } from '../lib/utils';

const Drawer = ({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Root>) => {
  return <DrawerPrimitive.Root data-slot='drawer' {...props} />;
};

const DrawerTrigger = ({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Trigger>) => {
  return <DrawerPrimitive.Trigger data-slot='drawer-trigger' {...props} />;
};

const DrawerPortal = ({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Portal>) => {
  return <DrawerPrimitive.Portal data-slot='drawer-portal' {...props} />;
};

const DrawerClose = ({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Close>) => {
  return <DrawerPrimitive.Close data-slot='drawer-close' {...props} />;
};

const DrawerOverlay = ({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Backdrop>) => {
  return (
    <DrawerPrimitive.Backdrop
      className={cn(
        'fixed inset-0 z-50 bg-black/50',
        'transition-opacity duration-300',
        'data-[ending-style]:opacity-0 data-[starting-style]:opacity-0',
        className
      )}
      data-slot='drawer-overlay'
      {...props}
    />
  );
};

const DrawerContent = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Popup>) => {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Viewport className='fixed inset-0 z-50 flex items-end'>
        <DrawerPrimitive.Popup
          className={cn(
            'bg-background flex flex-col outline-none',
            'w-full rounded-t-lg border-t',
            'transition-transform duration-300 ease-out',
            'data-[ending-style]:translate-y-full data-[starting-style]:translate-y-full',
            'mb-[-100vh] pb-[100vh]',
            className
          )}
          data-slot='drawer-content'
          {...props}
        >
          <div className='bg-muted mx-auto mt-4 mb-2 h-1.5 w-[100px] shrink-0 rounded-full' />
          <DrawerPrimitive.Content className='relative flex h-full flex-col overflow-y-auto'>
            {children}
          </DrawerPrimitive.Content>
        </DrawerPrimitive.Popup>
      </DrawerPrimitive.Viewport>
    </DrawerPortal>
  );
};

const DrawerHeader = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      className={cn('flex flex-col gap-1.5 p-4 text-center sm:text-left', className)}
      data-slot='drawer-header'
      {...props}
    />
  );
};

const DrawerFooter = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      className={cn('mt-auto flex flex-col gap-2 p-4', className)}
      data-slot='drawer-footer'
      {...props}
    />
  );
};

const DrawerTitle = ({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) => {
  return (
    <DrawerPrimitive.Title
      className={cn('text-foreground leading-none font-semibold', className)}
      data-slot='drawer-title'
      {...props}
    />
  );
};

const DrawerDescription = ({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) => {
  return (
    <DrawerPrimitive.Description
      className={cn('text-muted-foreground text-sm', className)}
      data-slot='drawer-description'
      {...props}
    />
  );
};

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger
};
