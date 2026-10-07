import { cn } from '@/shared/lib/tiptap-utils.ts';

import '@/shared/ui/tiptap-editor/tiptap-ui-primitive/separator/separator.scss';

export type Orientation = 'horizontal' | 'vertical';

export const Separator = ({
  decorative,
  orientation = 'vertical',
  className,
  ...props
}: React.ComponentProps<'div'> & {
  orientation?: Orientation;
  decorative?: boolean;
}) => {
  const ariaOrientation = orientation === 'vertical' ? orientation : undefined;
  const semanticProps = decorative
    ? { role: 'none' }
    : { 'aria-orientation': ariaOrientation, role: 'separator' };

  return (
    <div
      className={cn('tiptap-separator', className)}
      data-orientation={orientation}
      {...semanticProps}
      {...props}
    />
  );
};
