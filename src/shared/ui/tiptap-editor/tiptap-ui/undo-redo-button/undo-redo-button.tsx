'use client';

import { useCallback } from 'react';

// --- UI Primitives ---
import type { ButtonProps } from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/button';
// --- Tiptap UI ---
import type {
  UndoRedoAction,
  UseUndoRedoConfig
} from '@/shared/ui/tiptap-editor/tiptap-ui/undo-redo-button/index.tsx';

// --- Hooks ---
import { useTiptapEditor } from '@/shared/hooks/use-tiptap-editor.ts';
// --- Lib ---
import { parseShortcutKeys } from '@/shared/lib/tiptap-utils.ts';
import { Badge } from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/badge';
import { Button } from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/button';
import {
  UNDO_REDO_SHORTCUT_KEYS,
  useUndoRedo
} from '@/shared/ui/tiptap-editor/tiptap-ui/undo-redo-button/index.tsx';

export interface UndoRedoButtonProps extends Omit<ButtonProps, 'type'>, UseUndoRedoConfig {
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

export const HistoryShortcutBadge = ({
  action,
  shortcutKeys = UNDO_REDO_SHORTCUT_KEYS[action]
}: {
  action: UndoRedoAction;
  shortcutKeys?: string;
}) => {
  return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
};

/**
 * Button component for triggering undo/redo actions in a Tiptap editor.
 *
 * For custom button implementations, use the `useHistory` hook instead.
 */
export const UndoRedoButton = ({
  ref,
  editor: providedEditor,
  action,
  text,
  hideWhenUnavailable = false,
  onExecuted,
  showShortcut = false,
  onClick,
  children,
  ...buttonProps
}: UndoRedoButtonProps & { ref?: React.RefObject<HTMLButtonElement | null> }) => {
  const { editor } = useTiptapEditor(providedEditor);
  const { isVisible, handleAction, label, canExecute, Icon, shortcutKeys } = useUndoRedo({
    editor,
    action,
    hideWhenUnavailable,
    onExecuted
  });

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      handleAction();
    },
    [handleAction, onClick]
  );

  if (!isVisible) {
    return null;
  }

  return (
    <Button
      aria-label={label}
      data-disabled={!canExecute}
      disabled={!canExecute}
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
          {showShortcut && <HistoryShortcutBadge action={action} shortcutKeys={shortcutKeys} />}
        </>
      )}
    </Button>
  );
};

UndoRedoButton.displayName = 'UndoRedoButton';
