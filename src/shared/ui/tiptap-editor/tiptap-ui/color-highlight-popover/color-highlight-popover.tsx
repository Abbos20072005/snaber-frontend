import type { Editor } from '@tiptap/react';

import { useMemo, useRef, useState } from 'react';

// --- UI Primitives ---
import type { ButtonProps } from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/button';
// --- Tiptap UI ---
import type {
  HighlightColor,
  UseColorHighlightConfig
} from '@/shared/ui/tiptap-editor/tiptap-ui/color-highlight-button';

import { useIsBreakpoint } from '@/shared/hooks/use-is-breakpoint.ts';
// --- Hooks ---
import { useMenuNavigation } from '@/shared/hooks/use-menu-navigation.ts';
import { useTiptapEditor } from '@/shared/hooks/use-tiptap-editor.ts';
// --- Icons ---
import { BanIcon } from '@/shared/ui/tiptap-editor/tiptap-icons/ban-icon.tsx';
import { HighlighterIcon } from '@/shared/ui/tiptap-editor/tiptap-icons/highlighter-icon.tsx';
import { Button } from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/button';
import { ButtonGroup } from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/button-group';
import { Card, CardBody, CardItemGroup } from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/popover';
import { Separator } from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/separator';
import {
  ColorHighlightButton,
  pickHighlightColorsByValue,
  useColorHighlight
} from '@/shared/ui/tiptap-editor/tiptap-ui/color-highlight-button';

export interface ColorHighlightPopoverContentProps {
  /**
   * Optional colors to use in the highlight popover.
   * If not provided, defaults to a predefined set of colors.
   */
  colors?: HighlightColor[];
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor | null;
  /**
   * When true, uses the actual color value (colorValue) instead of CSS variable (value).
   * @default false
   */
  useColorValue?: boolean;
}

export interface ColorHighlightPopoverProps
  extends
    Omit<ButtonProps, 'type'>,
    Pick<UseColorHighlightConfig, 'editor' | 'hideWhenUnavailable' | 'onApplied'> {
  /**
   * Optional colors to use in the highlight popover.
   * If not provided, defaults to a predefined set of colors.
   */
  colors?: HighlightColor[];
  /**
   * When true, uses the actual color value (colorValue) instead of CSS variable (value).
   * @default false
   */
  useColorValue?: boolean;
}

export const ColorHighlightPopoverButton = ({
  ref,
  className,
  children,
  ...props
}: ButtonProps & { ref?: React.RefObject<HTMLButtonElement | null> }) => (
  <Button
    ref={ref}
    aria-label='Highlight text'
    className={className}
    data-appearance='default'
    tabIndex={-1}
    type='button'
    variant='ghost'
    role='button'
    tooltip='Highlight'
    {...props}
  >
    {children ?? <HighlighterIcon className='tiptap-button-icon' />}
  </Button>
);

ColorHighlightPopoverButton.displayName = 'ColorHighlightPopoverButton';

export const ColorHighlightPopoverContent = ({
  editor,
  colors = pickHighlightColorsByValue([
    'var(--tt-color-highlight-green)',
    'var(--tt-color-highlight-blue)',
    'var(--tt-color-highlight-red)',
    'var(--tt-color-highlight-purple)',
    'var(--tt-color-highlight-yellow)'
  ]),
  useColorValue = false
}: ColorHighlightPopoverContentProps) => {
  const { handleRemoveHighlight } = useColorHighlight({ editor });
  const isMobile = useIsBreakpoint();
  const containerRef = useRef<HTMLDivElement>(null);

  const menuItems = useMemo(
    () => [...colors, { label: 'Remove highlight', value: 'none' }],
    [colors]
  );

  const { selectedIndex } = useMenuNavigation({
    containerRef,
    items: menuItems,
    orientation: 'both',
    onSelect: (item) => {
      if (!containerRef.current) return false;
      const highlightedElement = containerRef.current.querySelector(
        '[data-highlighted="true"]'
      ) as HTMLElement;
      if (highlightedElement) highlightedElement.click();
      if (item.value === 'none') handleRemoveHighlight();
      return true;
    },
    autoSelectFirstItem: false
  });

  return (
    <Card ref={containerRef} style={isMobile ? { boxShadow: 'none', border: 0 } : {}} tabIndex={0}>
      <CardBody style={isMobile ? { padding: 0 } : {}}>
        <CardItemGroup orientation='horizontal'>
          <ButtonGroup>
            {colors.map((color, index) => (
              <ButtonGroup key={color.value}>
                <ColorHighlightButton
                  aria-label={`${color.label} highlight color`}
                  data-highlighted={selectedIndex === index}
                  tabIndex={index === selectedIndex ? 0 : -1}
                  editor={editor}
                  highlightColor={useColorValue ? color.colorValue : color.value}
                  tooltip={color.label}
                  useColorValue={useColorValue}
                />
              </ButtonGroup>
            ))}
          </ButtonGroup>
          <Separator />
          <ButtonGroup>
            <Button
              aria-label='Remove highlight'
              data-highlighted={selectedIndex === colors.length}
              tabIndex={selectedIndex === colors.length ? 0 : -1}
              type='button'
              variant='ghost'
              onClick={handleRemoveHighlight}
              role='menuitem'
              tooltip='Remove highlight'
            >
              <BanIcon className='tiptap-button-icon' />
            </Button>
          </ButtonGroup>
        </CardItemGroup>
      </CardBody>
    </Card>
  );
};

export const ColorHighlightPopover = ({
  editor: providedEditor,
  colors = pickHighlightColorsByValue([
    'var(--tt-color-highlight-green)',
    'var(--tt-color-highlight-blue)',
    'var(--tt-color-highlight-red)',
    'var(--tt-color-highlight-purple)',
    'var(--tt-color-highlight-yellow)'
  ]),
  hideWhenUnavailable = false,
  useColorValue = false,
  onApplied,
  ...props
}: ColorHighlightPopoverProps) => {
  const { editor } = useTiptapEditor(providedEditor);
  const [isOpen, setIsOpen] = useState(false);
  const { isVisible, canColorHighlight, isActive, label, Icon } = useColorHighlight({
    editor,
    hideWhenUnavailable,
    onApplied
  });

  if (!isVisible) return null;

  return (
    <Popover onOpenChange={setIsOpen} open={isOpen}>
      <PopoverTrigger
        render={
          <ColorHighlightPopoverButton
            aria-label={label}
            aria-pressed={isActive}
            data-active-state={isActive ? 'on' : 'off'}
            data-disabled={!canColorHighlight}
            disabled={!canColorHighlight}
            tooltip={label}
            {...props}
          >
            <Icon className='tiptap-button-icon' />
          </ColorHighlightPopoverButton>
        }
      />
      <PopoverContent aria-label='Highlight colors'>
        <ColorHighlightPopoverContent
          colors={colors}
          editor={editor}
          useColorValue={useColorValue}
        />
      </PopoverContent>
    </Popover>
  );
};

export default ColorHighlightPopover;
