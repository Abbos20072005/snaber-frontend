import { Fragment, useMemo } from 'react';

// --- Lib ---
import { cn, parseShortcutKeys } from '@/shared/lib/tiptap-utils.ts';
// --- Tiptap UI Primitive ---
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/tooltip';

import '@/shared/ui/tiptap-editor/tiptap-ui-primitive/button/button-colors.scss';
import '@/shared/ui/tiptap-editor/tiptap-ui-primitive/button/button.scss';

export type ButtonVariant = 'ghost' | 'primary';
export type ButtonSize = 'default' | 'large' | 'small';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shortcutKeys?: string;
  showTooltip?: boolean;
  size?: ButtonSize;
  tooltip?: React.ReactNode;
  variant?: ButtonVariant;
}

export const ShortcutDisplay: React.FC<{ shortcuts: string[] }> = ({ shortcuts }) => {
  if (shortcuts.length === 0) return null;

  return (
    <div>
      {shortcuts.map((key, index) => (
        <Fragment key={index}>
          {index > 0 && <kbd>+</kbd>}
          <kbd>{key}</kbd>
        </Fragment>
      ))}
    </div>
  );
};

export const Button = ({
  ref,
  className,
  children,
  tooltip,
  showTooltip = true,
  shortcutKeys,
  variant,
  size,
  ...props
}: ButtonProps & { ref?: React.RefObject<HTMLButtonElement | null> }) => {
  const shortcuts = useMemo<string[]>(() => parseShortcutKeys({ shortcutKeys }), [shortcutKeys]);

  if (!tooltip || !showTooltip) {
    return (
      <button
        ref={ref}
        className={cn('tiptap-button', className)}
        data-size={size}
        data-style={variant}
        data-slot='tiptap-button'
        {...props}
      >
        {children}
      </button>
    );
  }

  return (
    <Tooltip delay={200}>
      <TooltipTrigger
        ref={ref}
        className={cn('tiptap-button', className)}
        data-size={size}
        data-style={variant}
        data-slot='tiptap-button'
        {...props}
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>
        {tooltip}
        <ShortcutDisplay shortcuts={shortcuts} />
      </TooltipContent>
    </Tooltip>
  );
};

Button.displayName = 'Button';

export default Button;
