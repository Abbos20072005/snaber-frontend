import { Menu } from '@base-ui/react/menu';

import { cn } from '@/shared/lib/tiptap-utils';
import { CheckIcon } from '@/shared/ui/tiptap-editor/tiptap-icons/check-icon.tsx';

import '@/shared/ui/tiptap-editor/tiptap-ui-primitive/dropdown-menu/dropdown-menu.scss';

const DropdownMenu = Menu.Root;
const DropdownMenuPortal = Menu.Portal;
const DropdownMenuTrigger = Menu.Trigger;
const DropdownMenuRadioGroup = Menu.RadioGroup;

const DropdownMenuContent = ({
  className,
  align = 'start',
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof Menu.Popup> & {
  align?: 'center' | 'end' | 'start';
  sideOffset?: number;
  className?: string;
}) => (
  <Menu.Portal>
    <Menu.Positioner align={align} sideOffset={sideOffset}>
      <Menu.Popup className={cn('tiptap-dropdown-menu-content', className)} {...props} />
    </Menu.Positioner>
  </Menu.Portal>
);

const DropdownMenuGroup = ({ className, ...props }: React.ComponentProps<typeof Menu.Group>) => (
  <Menu.Group className={cn('tiptap-dropdown-menu-group', className as string)} {...props} />
);

const DropdownMenuItem = ({
  className,
  inset,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof Menu.Item> & {
  inset?: boolean;
  variant?: 'default' | 'destructive';
  className?: string;
}) => (
  <Menu.Item
    className={cn('tiptap-dropdown-menu-item', className)}
    data-inset={inset}
    data-variant={variant}
    {...props}
  />
);

const DropdownMenuCheckboxItem = ({
  className,
  children,
  checked,
  inset,
  ...props
}: React.ComponentProps<typeof Menu.CheckboxItem> & { inset?: boolean; className?: string }) => (
  <Menu.CheckboxItem
    checked={checked}
    className={cn('tiptap-dropdown-menu-checkbox-item', className)}
    data-inset={inset}
    {...props}
  >
    <span className='tiptap-dropdown-menu-item-indicator'>
      <Menu.CheckboxItemIndicator>
        <CheckIcon />
      </Menu.CheckboxItemIndicator>
    </span>
    {children}
  </Menu.CheckboxItem>
);

const DropdownMenuRadioItem = ({
  className,
  children,
  inset,
  ...props
}: React.ComponentProps<typeof Menu.RadioItem> & { inset?: boolean; className?: string }) => (
  <Menu.RadioItem
    className={cn('tiptap-dropdown-menu-radio-item', className)}
    data-inset={inset}
    {...props}
  >
    <span className='tiptap-dropdown-menu-item-indicator'>
      <Menu.RadioItemIndicator>
        <CheckIcon />
      </Menu.RadioItemIndicator>
    </span>
    {children}
  </Menu.RadioItem>
);

const DropdownMenuLabel = ({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof Menu.GroupLabel> & { inset?: boolean; className?: string }) => (
  <Menu.GroupLabel
    className={cn('tiptap-dropdown-menu-label', className)}
    data-inset={inset}
    {...props}
  />
);

const DropdownMenuSeparator = ({
  className,
  ...props
}: React.ComponentProps<typeof Menu.Separator>) => (
  <Menu.Separator
    className={cn('tiptap-dropdown-menu-separator', className as string)}
    {...props}
  />
);

const DropdownMenuShortcut = ({ className, ...props }: React.ComponentProps<'span'>) => (
  <span className={cn('tiptap-dropdown-menu-shortcut', className)} {...props} />
);

// Submenu
const DropdownMenuSub = Menu.SubmenuRoot;

const DropdownMenuSubTrigger = ({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof Menu.SubmenuTrigger> & { inset?: boolean; className?: string }) => (
  <Menu.SubmenuTrigger
    className={cn('tiptap-dropdown-menu-sub-trigger', className)}
    data-inset={inset}
    {...props}
  >
    {children}
  </Menu.SubmenuTrigger>
);

const DropdownMenuSubContent = ({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof Menu.Popup> & { sideOffset?: number; className?: string }) => (
  <Menu.Portal>
    <Menu.Positioner sideOffset={sideOffset}>
      <Menu.Popup className={cn('tiptap-dropdown-menu-sub-content', className)} {...props} />
    </Menu.Positioner>
  </Menu.Portal>
);

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
};
