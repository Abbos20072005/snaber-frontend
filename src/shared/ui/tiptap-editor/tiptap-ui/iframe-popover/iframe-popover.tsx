'use client';

import { useLingui } from '@lingui/react/macro';
import { useCallback, useState } from 'react';

import type { ButtonProps } from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/button';
import type { UseIframePopoverConfig } from '@/shared/ui/tiptap-editor/tiptap-ui/iframe-popover';

import { useIsBreakpoint } from '@/shared/hooks/use-is-breakpoint';
import { useTiptapEditor } from '@/shared/hooks/use-tiptap-editor';
import { CornerDownLeftIcon } from '@/shared/ui/tiptap-editor/tiptap-icons/corner-down-left-icon';
import { Button } from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/button';
import { ButtonGroup } from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/button-group';
import { Card, CardBody, CardItemGroup } from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/card';
import { Input } from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/popover';
import { useIframePopover } from '@/shared/ui/tiptap-editor/tiptap-ui/iframe-popover';

import './iframe-popover.scss';

export interface IframePopoverProps extends Omit<ButtonProps, 'type'>, UseIframePopoverConfig {
  onOpenChange?: (isOpen: boolean) => void;
}

export const IframePopover = ({
  ref,
  editor: providedEditor,
  hideWhenUnavailable = false,
  onSetIframe,
  onOpenChange,
  onClick,
  children,
  ...buttonProps
}: IframePopoverProps & { ref?: React.RefObject<HTMLButtonElement | null> }) => {
  const { t } = useLingui();

  const { editor } = useTiptapEditor(providedEditor);
  const isMobile = useIsBreakpoint();
  const [isOpen, setIsOpen] = useState(false);

  const { Icon, canSet, isActive, isVisible, label, setIframe, setValue, value, isValidURL } =
    useIframePopover({
      editor,
      hideWhenUnavailable,
      onSetIframe
    });

  const handleOpenChange = useCallback(
    (nextIsOpen: boolean) => {
      setIsOpen(nextIsOpen);
      onOpenChange?.(nextIsOpen);
    },
    [onOpenChange]
  );

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      setIsOpen(!isOpen);
    },
    [isOpen, onClick]
  );

  const handleSetIframe = useCallback(() => {
    if (setIframe()) {
      setIsOpen(false);
    }
  }, [setIframe]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleSetIframe();
      }
    },
    [handleSetIframe]
  );

  if (!isVisible) {
    return null;
  }

  return (
    <Popover onOpenChange={handleOpenChange} open={isOpen}>
      <PopoverTrigger
        render={
          <Button
            ref={ref}
            aria-label={label}
            aria-pressed={isActive}
            data-active-state={isActive ? 'on' : 'off'}
            data-disabled={!canSet}
            disabled={!canSet}
            tabIndex={-1}
            type='button'
            variant='ghost'
            onClick={handleClick}
            role='button'
            tooltip={label}
            {...buttonProps}
          >
            {children ?? <Icon className='tiptap-button-icon' />}
          </Button>
        }
      />

      <PopoverContent>
        <Card style={{ ...(isMobile ? { boxShadow: 'none', border: 0 } : {}) }}>
          <CardBody style={{ ...(isMobile ? { padding: 0 } : {}) }}>
            <CardItemGroup orientation='horizontal'>
              <Input
                className='tiptap-iframe-input'
                type='text'
                value={value}
                autoCapitalize='off'
                autoComplete='off'
                autoCorrect='off'
                autoFocus
                onChange={(event) => setValue(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t`Paste iframe or URL...`}
              />
              <ButtonGroup>
                <Button
                  disabled={!value.trim() || !isValidURL(value)}
                  title={t`Insert iframe`}
                  type='button'
                  variant='ghost'
                  onClick={handleSetIframe}
                >
                  <CornerDownLeftIcon className='tiptap-button-icon' />
                </Button>
              </ButtonGroup>
            </CardItemGroup>
          </CardBody>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

IframePopover.displayName = 'IframePopover';

export default IframePopover;
