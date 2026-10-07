'use client';

import { useCallback } from 'react';

// --- UI Primitives ---
import type { ButtonProps } from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/button';
// --- Tiptap UI ---
import type {
  Mark,
  UseMarkConfig
} from '@/shared/ui/tiptap-editor/tiptap-ui/mark-button/index.tsx';

// --- Hooks ---
import { useTiptapEditor } from '@/shared/hooks/use-tiptap-editor.ts';
// --- Lib ---
import { parseShortcutKeys } from '@/shared/lib/tiptap-utils.ts';
import { Badge } from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/badge';
import { Button } from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/button';
import {
  MARK_SHORTCUT_KEYS,
  useMark
} from '@/shared/ui/tiptap-editor/tiptap-ui/mark-button/index.tsx';

export interface MarkButtonProps extends Omit<ButtonProps, 'type'>, UseMarkConfig {
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

export const MarkShortcutBadge = ({
  type,
  shortcutKeys = MARK_SHORTCUT_KEYS[type]
}: {
  type: Mark;
  shortcutKeys?: string;
}) => {
  return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
};

/**
 * Button component for toggling marks in a Tiptap editor.
 *
 * For custom button implementations, use the `useMark` hook instead.
 */
export const MarkButton = ({
  ref,
  editor: providedEditor,
  type,
  text,
  hideWhenUnavailable = false,
  onToggled,
  showShortcut = false,
  onClick,
  children,
  ...buttonProps
}: MarkButtonProps & { ref?: React.RefObject<HTMLButtonElement | null> }) => {
  const { editor } = useTiptapEditor(providedEditor);
  const { isVisible, handleMark, label, canToggle, isActive, Icon, shortcutKeys } = useMark({
    editor,
    type,
    hideWhenUnavailable,
    onToggled
  });

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      handleMark();
    },
    [handleMark, onClick]
  );

  if (!isVisible) {
    return null;
  }

  return (
    <Button
      aria-label={label}
      aria-pressed={isActive}
      data-active-state={isActive ? 'on' : 'off'}
      data-disabled={!canToggle}
      disabled={!canToggle}
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
          <Icon className='tiptap-button-icon' />
          {text && <span className='tiptap-button-text'>{text}</span>}
          {showShortcut && <MarkShortcutBadge type={type} shortcutKeys={shortcutKeys} />}
        </>
      )}
    </Button>
  );
};

MarkButton.displayName = 'MarkButton';
