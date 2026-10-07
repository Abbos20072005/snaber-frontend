import { useCallback } from 'react';

// --- UI Primitives ---
import type { ButtonProps } from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/button';
// --- Tiptap UI ---
import type {
  Level,
  UseHeadingConfig
} from '@/shared/ui/tiptap-editor/tiptap-ui/heading-button/index.tsx';

import { useTiptapEditor } from '@/shared/hooks/use-tiptap-editor.ts';
// --- Lib ---
import { parseShortcutKeys } from '@/shared/lib/tiptap-utils.ts';
import { Badge } from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/badge';
import { Button } from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/button';
import {
  HEADING_SHORTCUT_KEYS,
  useHeading
} from '@/shared/ui/tiptap-editor/tiptap-ui/heading-button/index.tsx';

export interface HeadingButtonProps extends Omit<ButtonProps, 'type'>, UseHeadingConfig {
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

export const HeadingShortcutBadge = ({
  level,
  shortcutKeys = HEADING_SHORTCUT_KEYS[level]
}: {
  level: Level;
  shortcutKeys?: string;
}) => {
  return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
};

/**
 * Button component for toggling heading in a Tiptap editor.
 *
 * For custom button implementations, use the `useHeading` hook instead.
 */
export const HeadingButton = ({
  ref,
  editor: providedEditor,
  level,
  text,
  hideWhenUnavailable = false,
  onToggled,
  showShortcut = false,
  onClick,
  children,
  ...buttonProps
}: HeadingButtonProps & { ref?: React.RefObject<HTMLButtonElement | null> }) => {
  const { editor } = useTiptapEditor(providedEditor);
  const { isVisible, canToggle, isActive, handleToggle, label, Icon, shortcutKeys } = useHeading({
    editor,
    level,
    hideWhenUnavailable,
    onToggled
  });

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      handleToggle();
    },
    [handleToggle, onClick]
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
          {showShortcut && <HeadingShortcutBadge level={level} shortcutKeys={shortcutKeys} />}
        </>
      )}
    </Button>
  );
};

HeadingButton.displayName = 'HeadingButton';
