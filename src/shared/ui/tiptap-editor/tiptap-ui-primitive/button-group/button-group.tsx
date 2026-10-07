import type { VariantProps } from 'class-variance-authority';

import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva } from 'class-variance-authority';

import { cn } from '@/shared/lib/tiptap-utils.ts';
import { Separator } from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/separator';

import './button-group.scss';

const buttonGroupVariants = cva('tiptap-button-group', {
  variants: {
    orientation: {
      horizontal: 'tiptap-button-group-horizontal',
      vertical: 'tiptap-button-group-vertical'
    }
  },
  defaultVariants: {
    orientation: 'horizontal'
  }
});

const ButtonGroup = ({
  className,
  orientation,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof buttonGroupVariants>) => {
  return (
    <div
      className={cn(buttonGroupVariants({ orientation }), className)}
      data-orientation={orientation}
      data-slot='tiptap-button-group'
      role='group'
      {...props}
    />
  );
};

function ButtonGroupText({ className, render, ...props }: useRender.ComponentProps<'div'>) {
  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>({ className: cn('tiptap-button-group-text', className) }, props),
    render,
    state: { slot: 'tiptap-button-group-text' }
  });
}

const ButtonGroupSeparator = ({
  className,
  orientation = 'vertical',
  ...props
}: React.ComponentProps<typeof Separator>) => {
  return (
    <Separator
      className={cn('tiptap-button-group-separator', className)}
      data-slot='tiptap-button-group-separator'
      orientation={orientation}
      {...props}
    />
  );
};

export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText, buttonGroupVariants };
