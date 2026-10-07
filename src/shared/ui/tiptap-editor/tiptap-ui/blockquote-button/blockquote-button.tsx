import { useCallback } from 'react';

// --- UI Primitives ---
import type { ButtonProps } from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/button';
// --- Tiptap UI ---
import type { UseBlockquoteConfig } from '@/shared/ui/tiptap-editor/tiptap-ui/blockquote-button/index.tsx';

// --- Hooks ---
import { useTiptapEditor } from '@/shared/hooks/use-tiptap-editor.ts';
// --- Lib ---
import { parseShortcutKeys } from '@/shared/lib/tiptap-utils.ts';
import { Badge } from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/badge';
import { Button } from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/button';
import {
  BLOCKQUOTE_SHORTCUT_KEY,
  useBlockquote
} from '@/shared/ui/tiptap-editor/tiptap-ui/blockquote-button/index.tsx';

export interface BlockquoteButtonProps extends Omit<ButtonProps, 'type'>, UseBlockquoteConfig {
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

export const BlockquoteShortcutBadge = ({
  shortcutKeys = BLOCKQUOTE_SHORTCUT_KEY
}: {
  shortcutKeys?: string;
}) => {
  return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
};

/**
 * Button component for toggling blockquote in a Tiptap editor.
 *
 * For custom button implementations, use the `useBlockquote` hook instead.
 */
export const BlockquoteButton = ({
  ref,
  editor: providedEditor,
  text,
  hideWhenUnavailable = false,
  onToggled,
  showShortcut = false,
  onClick,
  children,
  ...buttonProps
}: BlockquoteButtonProps & { ref?: React.RefObject<HTMLButtonElement | null> }) => {
  const { editor } = useTiptapEditor(providedEditor);
  const { isVisible, canToggle, isActive, handleToggle, label, shortcutKeys, Icon } = useBlockquote(
    {
      editor,
      hideWhenUnavailable,
      onToggled
    }
  );

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
      tooltip='Blockquote'
      {...buttonProps}
      ref={ref}
    >
      {children ?? (
        <>
          <Icon className='tiptap-button-icon' />
          {text && <span className='tiptap-button-text'>{text}</span>}
          {showShortcut && <BlockquoteShortcutBadge shortcutKeys={shortcutKeys} />}
        </>
      )}
    </Button>
  );
};

BlockquoteButton.displayName = 'BlockquoteButton';
