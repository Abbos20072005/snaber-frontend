import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { useLingui } from '@lingui/react/macro';
import { XIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';

const Dialog = ({ ...props }: DialogPrimitive.Root.Props) => {
  return <DialogPrimitive.Root data-slot='dialog' {...props} />;
};

const DialogTrigger = ({ ...props }: DialogPrimitive.Trigger.Props) => {
  return <DialogPrimitive.Trigger data-slot='dialog-trigger' {...props} />;
};

const DialogPortal = ({ ...props }: DialogPrimitive.Portal.Props) => {
  return <DialogPrimitive.Portal data-slot='dialog-portal' {...props} />;
};

const DialogClose = ({ ...props }: DialogPrimitive.Close.Props) => {
  return <DialogPrimitive.Close data-slot='dialog-close' {...props} />;
};

const DialogOverlay = ({ className, ...props }: DialogPrimitive.Backdrop.Props) => {
  return (
    <DialogPrimitive.Backdrop
      className={cn(
        'data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs',
        className
      )}
      data-slot='dialog-overlay'
      {...props}
    />
  );
};

const DialogContent = ({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean;
}) => {
  const { t } = useLingui();
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        className={cn(
          'bg-popover text-popover-foreground ring-foreground/10 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 fixed top-1/2 left-1/2 z-50 flex w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col gap-6 rounded-xl p-6 text-sm ring-1 duration-100 outline-none sm:max-w-md',
          className
        )}
        data-slot='dialog-content'
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            render={(props) => (
              <Button {...props} className='absolute top-2 right-2' size='icon-sm' variant='ghost'>
                <XIcon />
                <span className='sr-only'>{t`Close`}</span>
              </Button>
            )}
            data-slot='dialog-close'
          />
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  );
};

const DialogHeader = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div className={cn('flex flex-col gap-2', className)} data-slot='dialog-header' {...props} />
  );
};

const DialogFooter = ({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  showCloseButton?: boolean;
}) => {
  const { t } = useLingui();
  return (
    <div
      className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      data-slot='dialog-footer'
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant='outline' />}>
          {t`Close`}
        </DialogPrimitive.Close>
      )}
    </div>
  );
};

const DialogTitle = ({ className, ...props }: DialogPrimitive.Title.Props) => {
  return (
    <DialogPrimitive.Title
      className={cn('font-heading leading-none font-medium', className)}
      data-slot='dialog-title'
      {...props}
    />
  );
};

const DialogDescription = ({ className, ...props }: DialogPrimitive.Description.Props) => {
  return (
    <DialogPrimitive.Description
      className={cn(
        'text-muted-foreground *:[a]:hover:text-foreground text-sm *:[a]:underline *:[a]:underline-offset-3',
        className
      )}
      data-slot='dialog-description'
      {...props}
    />
  );
};

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger
};
