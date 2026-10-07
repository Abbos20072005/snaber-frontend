'use client';

import type { Editor } from '@tiptap/react';

import { useCallback, useEffect, useState } from 'react';

// --- UI Primitives ---
import type { ButtonProps } from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/button';
// --- Tiptap UI ---
import type { UseLinkPopoverConfig } from '@/shared/ui/tiptap-editor/tiptap-ui/link-popover/index.tsx';

// --- Hooks ---
import { useIsBreakpoint } from '@/shared/hooks/use-is-breakpoint.ts';
import { useTiptapEditor } from '@/shared/hooks/use-tiptap-editor.ts';
// --- Icons ---
import { CornerDownLeftIcon } from '@/shared/ui/tiptap-editor/tiptap-icons/corner-down-left-icon.tsx';
import { ExternalLinkIcon } from '@/shared/ui/tiptap-editor/tiptap-icons/external-link-icon.tsx';
import { LinkIcon } from '@/shared/ui/tiptap-editor/tiptap-icons/link-icon.tsx';
import { TrashIcon } from '@/shared/ui/tiptap-editor/tiptap-icons/trash-icon.tsx';
import { Button } from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/button';
import { ButtonGroup } from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/button-group';
import { Card, CardBody, CardItemGroup } from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/card';
import { Input } from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/popover';
import { Separator } from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/separator';
import { useLinkPopover } from '@/shared/ui/tiptap-editor/tiptap-ui/link-popover/index.tsx';

import './link-popover.scss';

export interface LinkMainProps {
  /**
   * Whether the link is currently active in the editor.
   */
  isActive: boolean;
  /**
   * Function to update the URL state.
   */
  setUrl: React.Dispatch<React.SetStateAction<string | null>>;
  /**
   * The URL to set for the link.
   */
  url: string;
  /**
   * Function to open the link.
   */
  openLink: () => void;
  /**
   * Function to remove the link from the editor.
   */
  removeLink: () => void;
  /**
   * Function to set the link in the editor.
   */
  setLink: () => void;
}

export interface LinkPopoverProps extends Omit<ButtonProps, 'type'>, UseLinkPopoverConfig {
  /**
   * Whether to automatically open the popover when a link is active.
   * @default true
   */
  autoOpenOnLinkActive?: boolean;
  /**
   * Callback for when the popover opens or closes.
   */
  onOpenChange?: (isOpen: boolean) => void;
}

/**
 * Link button component for triggering the link popover
 */
export const LinkButton = ({
  ref,
  className,
  children,
  ...props
}: ButtonProps & { ref?: React.RefObject<HTMLButtonElement | null> }) => {
  return (
    <Button
      ref={ref}
      aria-label='Link'
      className={className}
      tabIndex={-1}
      type='button'
      variant='ghost'
      role='button'
      tooltip='Link'
      {...props}
    >
      {children || <LinkIcon className='tiptap-button-icon' />}
    </Button>
  );
};

LinkButton.displayName = 'LinkButton';

/**
 * Main content component for the link popover
 */
const LinkMain: React.FC<LinkMainProps> = ({
  url,
  setUrl,
  setLink,
  removeLink,
  openLink,
  isActive
}) => {
  const isMobile = useIsBreakpoint();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setLink();
    }
  };

  return (
    <Card
      style={{
        ...(isMobile ? { boxShadow: 'none', border: 0 } : {})
      }}
    >
      <CardBody
        style={{
          ...(isMobile ? { padding: 0 } : {})
        }}
      >
        <CardItemGroup orientation='horizontal'>
          <Input
            className='tiptap-link-input'
            type='url'
            value={url}
            autoCapitalize='off'
            autoComplete='off'
            autoCorrect='off'
            autoFocus
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Paste a link...'
          />

          <ButtonGroup>
            <Button
              disabled={!url && !isActive}
              title='Apply link'
              type='button'
              variant='ghost'
              onClick={setLink}
            >
              <CornerDownLeftIcon className='tiptap-button-icon' />
            </Button>
          </ButtonGroup>

          <Separator />

          <ButtonGroup>
            <ButtonGroup>
              <Button
                disabled={!url && !isActive}
                title='Open in new window'
                type='button'
                variant='ghost'
                onClick={openLink}
              >
                <ExternalLinkIcon className='tiptap-button-icon' />
              </Button>
            </ButtonGroup>

            <ButtonGroup>
              <Button
                disabled={!url && !isActive}
                title='Remove link'
                type='button'
                variant='ghost'
                onClick={removeLink}
              >
                <TrashIcon className='tiptap-button-icon' />
              </Button>
            </ButtonGroup>
          </ButtonGroup>
        </CardItemGroup>
      </CardBody>
    </Card>
  );
};

/**
 * Link content component for standalone use
 */
export const LinkContent: React.FC<{
  editor?: Editor | null;
}> = ({ editor }) => {
  const linkPopover = useLinkPopover({
    editor
  });

  return <LinkMain {...linkPopover} />;
};

/**
 * Link popover component for Tiptap editors.
 *
 * For custom popover implementations, use the `useLinkPopover` hook instead.
 */
export const LinkPopover = ({
  ref,
  editor: providedEditor,
  hideWhenUnavailable = false,
  onSetLink,
  onOpenChange,
  autoOpenOnLinkActive = true,
  onClick,
  children,
  ...buttonProps
}: LinkPopoverProps & { ref?: React.RefObject<HTMLButtonElement | null> }) => {
  const { editor } = useTiptapEditor(providedEditor);
  const [isOpen, setIsOpen] = useState(false);

  const { isVisible, canSet, isActive, url, setUrl, setLink, removeLink, openLink, label, Icon } =
    useLinkPopover({
      editor,
      hideWhenUnavailable,
      onSetLink
    });

  const handleOnOpenChange = useCallback(
    (nextIsOpen: boolean) => {
      setIsOpen(nextIsOpen);
      onOpenChange?.(nextIsOpen);
    },
    [onOpenChange]
  );

  const handleSetLink = useCallback(() => {
    setLink();
    setIsOpen(false);
  }, [setLink]);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      setIsOpen(!isOpen);
    },
    [onClick, isOpen]
  );

  useEffect(() => {
    if (autoOpenOnLinkActive && isActive) {
      setIsOpen(true);
    }
  }, [autoOpenOnLinkActive, isActive]);

  if (!isVisible) {
    return null;
  }

  return (
    <Popover onOpenChange={handleOnOpenChange} open={isOpen}>
      <PopoverTrigger
        render={
          <LinkButton
            aria-label={label}
            aria-pressed={isActive}
            data-active-state={isActive ? 'on' : 'off'}
            data-disabled={!canSet}
            disabled={!canSet}
            onClick={handleClick}
            {...buttonProps}
            ref={ref}
          >
            {children ?? <Icon className='tiptap-button-icon' />}
          </LinkButton>
        }
      />

      <PopoverContent>
        <LinkMain
          isActive={isActive}
          setLink={handleSetLink}
          setUrl={setUrl}
          url={url}
          openLink={openLink}
          removeLink={removeLink}
        />
      </PopoverContent>
    </Popover>
  );
};

LinkPopover.displayName = 'LinkPopover';

export default LinkPopover;
