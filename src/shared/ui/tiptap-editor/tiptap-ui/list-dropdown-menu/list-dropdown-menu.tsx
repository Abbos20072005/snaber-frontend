import type { Editor } from '@tiptap/react';

import { useCallback, useState } from 'react';

// --- UI Primitives ---
import type { ButtonProps } from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/button';
import type { ListType } from '@/shared/ui/tiptap-editor/tiptap-ui/list-button';

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
import { ListButton } from '@/shared/ui/tiptap-editor/tiptap-ui/list-button';
import { useListDropdownMenu } from '@/shared/ui/tiptap-editor/tiptap-ui/list-dropdown-menu/use-list-dropdown-menu.ts';

export interface ListDropdownMenuProps extends Omit<ButtonProps, 'type'> {
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor;
  /**
   * Whether the dropdown should be hidden when no list types are available
   * @default false
   */
  hideWhenUnavailable?: boolean;
  /**
   * Whether the dropdown should use a modal
   */
  modal?: boolean;
  /**
   * The list types to display in the dropdown.
   */
  types?: ListType[];
  /**
   * Callback for when the dropdown opens or closes
   */
  onOpenChange?: (isOpen: boolean) => void;
}

export const ListDropdownMenu = ({
  editor: providedEditor,
  types = ['bulletList', 'orderedList', 'taskList'],
  hideWhenUnavailable = false,
  onOpenChange,
  modal = true,
  ...props
}: ListDropdownMenuProps) => {
  const { editor } = useTiptapEditor(providedEditor);
  const [isOpen, setIsOpen] = useState(false);

  const { filteredLists, canToggle, isActive, isVisible, Icon } = useListDropdownMenu({
    editor,
    types,
    hideWhenUnavailable
  });

  const handleOnOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open);
      onOpenChange?.(open);
    },
    [onOpenChange]
  );

  if (!isVisible) {
    return null;
  }

  return (
    <DropdownMenu modal={modal} onOpenChange={handleOnOpenChange} open={isOpen}>
      <DropdownMenuTrigger
        render={
          <Button
            aria-label='List options'
            data-active-state={isActive ? 'on' : 'off'}
            data-disabled={!canToggle}
            disabled={!canToggle}
            tabIndex={-1}
            type='button'
            variant='ghost'
            role='button'
            tooltip='List'
            {...props}
          >
            <Icon className='tiptap-button-icon' />
            <ChevronDownIcon className='tiptap-button-dropdown-small' />
          </Button>
        }
      />

      <DropdownMenuContent align='start'>
        <DropdownMenuGroup>
          {filteredLists.map((option) => (
            <DropdownMenuItem
              key={option.type}
              render={
                <ListButton
                  text={option.label}
                  type={option.type}
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

export default ListDropdownMenu;
