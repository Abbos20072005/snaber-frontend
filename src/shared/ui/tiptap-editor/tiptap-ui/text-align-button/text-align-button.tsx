'use client';

import { useCallback } from 'react';

// --- UI Primitives ---
import type { ButtonProps } from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/button';
// --- Tiptap UI ---
import type {
  TextAlign,
  UseTextAlignConfig
} from '@/shared/ui/tiptap-editor/tiptap-ui/text-align-button/index.tsx';

// --- Hooks ---
import { useTiptapEditor } from '@/shared/hooks/use-tiptap-editor.ts';
// --- Lib ---
import { parseShortcutKeys } from '@/shared/lib/tiptap-utils.ts';
import { Badge } from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/badge';
import { Button } from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/button';
import {
  TEXT_ALIGN_SHORTCUT_KEYS,
  useTextAlign
} from '@/shared/ui/tiptap-editor/tiptap-ui/text-align-button/index.tsx';

type IconProps = React.SVGProps<SVGSVGElement>;
type IconComponent = ({ className, ...props }: IconProps) => React.ReactElement;

export interface TextAlignButtonProps extends Omit<ButtonProps, 'type'>, UseTextAlignConfig {
  /**
   * Optional custom icon component to render instead of the default.
   */
  icon?: React.FC<IconProps> | React.MemoExoticComponent<IconComponent>;
  /**
   * Optional show shortcut keys in the button.
   * @default false
   */
  showShortcut?: boolean;
  /**
   * Optional text to display alongside the icon.
   */
  text?: string;
}

export const TextAlignShortcutBadge = ({
  align,
  shortcutKeys = TEXT_ALIGN_SHORTCUT_KEYS[align]
}: {
  align: TextAlign;
  shortcutKeys?: string;
}) => {
  return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
};

/**
 * Button component for setting text alignment in a Tiptap editor.
 *
 * For custom button implementations, use the `useTextAlign` hook instead.
 */
export const TextAlignButton = ({
  ref,
  editor: providedEditor,
  align,
  text,
  hideWhenUnavailable = false,
  onAligned,
  showShortcut = false,
  onClick,
  icon: CustomIcon,
  children,
  ...buttonProps
}: TextAlignButtonProps & { ref?: React.RefObject<HTMLButtonElement | null> }) => {
  const { editor } = useTiptapEditor(providedEditor);
  const { isVisible, handleTextAlign, label, canAlign, isActive, Icon, shortcutKeys } =
    useTextAlign({
      editor,
      align,
      hideWhenUnavailable,
      onAligned
    });

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      handleTextAlign();
    },
    [handleTextAlign, onClick]
  );

  if (!isVisible) {
    return null;
  }

  const RenderIcon = CustomIcon ?? Icon;

  return (
    <Button
      aria-label={label}
      aria-pressed={isActive}
      data-active-state={isActive ? 'on' : 'off'}
      data-disabled={!canAlign}
      disabled={!canAlign}
      tabIndex={-1}
      type='button'
      variant='ghost'
      onClick={handleClick}
      role='button'
      tooltip={label}
      {...buttonProps}
      ref={ref}
    >
      {children ?? (
        <>
          <RenderIcon className='tiptap-button-icon' />
          {text && <span className='tiptap-button-text'>{text}</span>}
          {showShortcut && <TextAlignShortcutBadge align={align} shortcutKeys={shortcutKeys} />}
        </>
      )}
    </Button>
  );
};

TextAlignButton.displayName = 'TextAlignButton';
