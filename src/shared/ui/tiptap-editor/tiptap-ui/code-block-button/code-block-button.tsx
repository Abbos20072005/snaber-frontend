import { useCallback } from 'react';

// --- UI Primitives ---
import type { ButtonProps } from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/button';
// --- Tiptap UI ---
import type { UseCodeBlockConfig } from '@/shared/ui/tiptap-editor/tiptap-ui/code-block-button/index.tsx';

// --- Hooks ---
import { useTiptapEditor } from '@/shared/hooks/use-tiptap-editor.ts';
// --- Lib ---
import { parseShortcutKeys } from '@/shared/lib/tiptap-utils.ts';
import { Badge } from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/badge';
import { Button } from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/button';
import {
  CODE_BLOCK_SHORTCUT_KEY,
  useCodeBlock
} from '@/shared/ui/tiptap-editor/tiptap-ui/code-block-button/index.tsx';

export interface CodeBlockButtonProps extends Omit<ButtonProps, 'type'>, UseCodeBlockConfig {
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

export const CodeBlockShortcutBadge = ({
  shortcutKeys = CODE_BLOCK_SHORTCUT_KEY
}: {
  shortcutKeys?: string;
}) => {
  return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
};

/**
 * Button component for toggling code block in a Tiptap editor.
 *
 * For custom button implementations, use the `useCodeBlock` hook instead.
 */
export const CodeBlockButton = ({
  ref,
  editor: providedEditor,
  text,
  hideWhenUnavailable = false,
  onToggled,
  showShortcut = false,
  onClick,
  children,
  ...buttonProps
}: CodeBlockButtonProps & { ref?: React.RefObject<HTMLButtonElement | null> }) => {
  const { editor } = useTiptapEditor(providedEditor);
  const { isVisible, canToggle, isActive, handleToggle, label, shortcutKeys, Icon } = useCodeBlock({
    editor,
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
      tooltip='Code Block'
      {...buttonProps}
      ref={ref}
    >
      {children ?? (
        <>
          <Icon className='tiptap-button-icon' />
          {text && <span className='tiptap-button-text'>{text}</span>}
          {showShortcut && <CodeBlockShortcutBadge shortcutKeys={shortcutKeys} />}
        </>
      )}
    </Button>
  );
};

CodeBlockButton.displayName = 'CodeBlockButton';
