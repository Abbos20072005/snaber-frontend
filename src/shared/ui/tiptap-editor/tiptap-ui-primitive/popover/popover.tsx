import { Popover as BasePopover } from '@base-ui/react/popover';

import { cn } from '@/shared/lib/tiptap-utils.ts';

import '@/shared/ui/tiptap-editor/tiptap-ui-primitive/popover/popover.scss';

const Popover = BasePopover.Root;

const PopoverTrigger = BasePopover.Trigger;

const PopoverContent = ({
  className,
  align = 'center',
  sideOffset = 4,
  children,
  ...props
}: React.ComponentProps<typeof BasePopover.Popup> & {
  className?: string;
  align?: 'center' | 'end' | 'start';
  sideOffset?: number;
}) => {
  return (
    <BasePopover.Portal>
      <BasePopover.Positioner align={align} sideOffset={sideOffset}>
        <BasePopover.Popup className={cn('tiptap-popover', className)} {...props}>
          {children}
        </BasePopover.Popup>
      </BasePopover.Positioner>
    </BasePopover.Portal>
  );
};

export { Popover, PopoverContent, PopoverTrigger };
