import { useCallback, useState } from 'react';

// --- UI Primitives ---
import type { ButtonProps } from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/button';
import type { UseHeadingDropdownMenuConfig } from '@/shared/ui/tiptap-editor/tiptap-ui/heading-dropdown-menu/index.tsx';

// --- Hooks ---
import { useTiptapEditor } from '@/shared/hooks/use-tiptap-editor.ts';
// --- Icons ---
import { ChevronDownIcon } from '@/shared/ui/tiptap-editor/tiptap-icons/chevron-down-icon.tsx';
import { Button } from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/dropdown-menu';
// --- Tiptap UI ---
import { HeadingButton } from '@/shared/ui/tiptap-editor/tiptap-ui/heading-button';
import { useHeadingDropdownMenu } from '@/shared/ui/tiptap-editor/tiptap-ui/heading-dropdown-menu/index.tsx';

export interface HeadingDropdownMenuProps
  extends Omit<ButtonProps, 'type'>, UseHeadingDropdownMenuConfig {
  /**
   * Whether the dropdown should use a modal
   */
  modal?: boolean;
  /**
   * Callback for when the dropdown opens or closes
   */
  onOpenChange?: (isOpen: boolean) => void;
}

/**
 * Dropdown menu component for selecting heading levels in a Tiptap editor.
 *
 * For custom dropdown implementations, use the `useHeadingDropdownMenu` hook instead.
 */
export const HeadingDropdownMenu = ({
  ref,
  editor: providedEditor,
  levels = [1, 2, 3, 4, 5, 6],
  hideWhenUnavailable = false,
  onOpenChange,
  children,
  modal = true,
  ...buttonProps
}: HeadingDropdownMenuProps & { ref?: React.RefObject<HTMLButtonElement | null> }) => {
  const { editor } = useTiptapEditor(providedEditor);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { isVisible, isActive, canToggle, Icon } = useHeadingDropdownMenu({
    editor,
    levels,
    hideWhenUnavailable
  });

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!editor || !canToggle) return;
      setIsOpen(open);
      onOpenChange?.(open);
    },
    [canToggle, editor, onOpenChange]
  );

  if (!isVisible) {
    return null;
  }

  return (
    <DropdownMenu modal={modal} onOpenChange={handleOpenChange} open={isOpen}>
      <DropdownMenuTrigger
        render={
          <Button
            aria-label='Format text as heading'
            aria-pressed={isActive}
            data-active-state={isActive ? 'on' : 'off'}
            data-disabled={!canToggle}
            disabled={!canToggle}
            tabIndex={-1}
            type='button'
            variant='ghost'
            role='button'
            tooltip='Heading'
            {...buttonProps}
            ref={ref}
          >
            {children || (
              <>
                <Icon className='tiptap-button-icon' />
                <ChevronDownIcon className='tiptap-button-dropdown-small' />
              </>
            )}
          </Button>
        }
      />

      <DropdownMenuContent align='start'>
        <DropdownMenuGroup>
          {levels.map((level) => (
            <DropdownMenuItem
              key={`heading-${level}`}
              render={
                <HeadingButton
                  level={level}
                  text={`Heading ${level}`}
                  editor={editor}
                  showTooltip={false}
                />
              }
            ></DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

HeadingDropdownMenu.displayName = 'HeadingDropdownMenu';

export default HeadingDropdownMenu;
