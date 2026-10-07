import { cn } from '@/shared/lib/tiptap-utils.ts';

import '@/shared/ui/tiptap-editor/tiptap-ui-primitive/input/input.scss';

const Input = ({ className, type, ...props }: React.ComponentProps<'input'>) => {
  return (
    <input
      className={cn('tiptap-input', className)}
      type={type}
      data-slot='tiptap-input'
      {...props}
    />
  );
};

export { Input };
