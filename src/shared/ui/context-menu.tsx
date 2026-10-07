'use client';

import { ContextMenu as ContextMenuPrimitive } from '@base-ui/react/context-menu';
import { CheckIcon, ChevronRightIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/shared/lib/utils';

const ContextMenu = ({ ...props }: ContextMenuPrimitive.Root.Props) => {
  return <ContextMenuPrimitive.Root data-slot='context-menu' {...props} />;
};

const ContextMenuPortal = ({ ...props }: ContextMenuPrimitive.Portal.Props) => {
  return <ContextMenuPrimitive.Portal data-slot='context-menu-portal' {...props} />;
};

const ContextMenuTrigger = ({ className, ...props }: ContextMenuPrimitive.Trigger.Props) => {
  return (
    <ContextMenuPrimitive.Trigger
      className={cn('select-none', className)}
      data-slot='context-menu-trigger'
      {...props}
    />
  );
};

const ContextMenuContent = ({
  className,
  align = 'start',
  alignOffset = 4,
  side = 'right',
  sideOffset = 0,
  ...props
}: ContextMenuPrimitive.Popup.Props &
  Pick<ContextMenuPrimitive.Positioner.Props, 'align' | 'alignOffset' | 'side' | 'sideOffset'>) => {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        className='isolate z-50 outline-none'
        side={side}
        sideOffset={sideOffset}
      >
        <ContextMenuPrimitive.Popup
          className={cn(
            'bg-popover text-popover-foreground ring-foreground/10 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 z-50 max-h-(--available-height) min-w-36 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-md p-1 shadow-md ring-1 duration-100 outline-none',
            className
          )}
          data-slot='context-menu-content'
          {...props}
        />
      </ContextMenuPrimitive.Positioner>
    </ContextMenuPrimitive.Portal>
  );
};

const ContextMenuGroup = ({ ...props }: ContextMenuPrimitive.Group.Props) => {
  return <ContextMenuPrimitive.Group data-slot='context-menu-group' {...props} />;
};

const ContextMenuLabel = ({
  className,
  inset,
  ...props
}: ContextMenuPrimitive.GroupLabel.Props & {
  inset?: boolean;
}) => {
  return (
    <ContextMenuPrimitive.GroupLabel
      className={cn(
        'text-muted-foreground px-2 py-1.5 text-xs font-medium data-inset:pl-8',
        className
      )}
      data-inset={inset}
      data-slot='context-menu-label'
      {...props}
    />
  );
};

const ContextMenuItem = ({
  className,
  inset,
  variant = 'default',
  ...props
}: ContextMenuPrimitive.Item.Props & {
  inset?: boolean;
  variant?: 'default' | 'destructive';
}) => {
  return (
    <ContextMenuPrimitive.Item
      className={cn(
        "group/context-menu-item focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 focus:*:[svg]:text-accent-foreground data-[variant=destructive]:*:[svg]:text-destructive relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      data-inset={inset}
      data-variant={variant}
      data-slot='context-menu-item'
      {...props}
    />
  );
};

const ContextMenuSub = ({ ...props }: ContextMenuPrimitive.SubmenuRoot.Props) => {
  return <ContextMenuPrimitive.SubmenuRoot data-slot='context-menu-sub' {...props} />;
};

const ContextMenuSubTrigger = ({
  className,
  inset,
  children,
  ...props
}: ContextMenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean;
}) => {
  return (
    <ContextMenuPrimitive.SubmenuTrigger
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-open:bg-accent data-open:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-inset:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      data-inset={inset}
      data-slot='context-menu-sub-trigger'
      {...props}
    >
      {children}
      <ChevronRightIcon className='ml-auto' />
    </ContextMenuPrimitive.SubmenuTrigger>
  );
};

const ContextMenuSubContent = ({ ...props }: React.ComponentProps<typeof ContextMenuContent>) => {
  return (
    <ContextMenuContent
      className='shadow-lg'
      side='right'
      data-slot='context-menu-sub-content'
      {...props}
    />
  );
};

const ContextMenuCheckboxItem = ({
  className,
  children,
  checked,
  inset,
  ...props
}: ContextMenuPrimitive.CheckboxItem.Props & {
  inset?: boolean;
}) => {
  return (
    <ContextMenuPrimitive.CheckboxItem
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      data-inset={inset}
      data-slot='context-menu-checkbox-item'
      {...props}
    >
      <span className='pointer-events-none absolute right-2'>
        <ContextMenuPrimitive.CheckboxItemIndicator>
          <CheckIcon />
        </ContextMenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  );
};

const ContextMenuRadioGroup = ({ ...props }: ContextMenuPrimitive.RadioGroup.Props) => {
  return <ContextMenuPrimitive.RadioGroup data-slot='context-menu-radio-group' {...props} />;
};

const ContextMenuRadioItem = ({
  className,
  children,
  inset,
  ...props
}: ContextMenuPrimitive.RadioItem.Props & {
  inset?: boolean;
}) => {
  return (
    <ContextMenuPrimitive.RadioItem
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      data-inset={inset}
      data-slot='context-menu-radio-item'
      {...props}
    >
      <span className='pointer-events-none absolute right-2'>
        <ContextMenuPrimitive.RadioItemIndicator>
          <CheckIcon />
        </ContextMenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  );
};

const ContextMenuSeparator = ({ className, ...props }: ContextMenuPrimitive.Separator.Props) => {
  return (
    <ContextMenuPrimitive.Separator
      className={cn('bg-border -mx-1 my-1 h-px', className)}
      data-slot='context-menu-separator'
      {...props}
    />
  );
};

const ContextMenuShortcut = ({ className, ...props }: React.ComponentProps<'span'>) => {
  return (
    <span
      className={cn(
        'text-muted-foreground group-focus/context-menu-item:text-accent-foreground ml-auto text-xs tracking-widest',
        className
      )}
      data-slot='context-menu-shortcut'
      {...props}
    />
  );
};

export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger
};
