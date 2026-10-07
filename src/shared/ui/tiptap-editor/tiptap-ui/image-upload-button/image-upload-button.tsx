import { useCallback } from 'react';

// --- UI Primitives ---
import type { ButtonProps } from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/button';
// --- Tiptap UI ---
import type { UseImageUploadConfig } from '@/shared/ui/tiptap-editor/tiptap-ui/image-upload-button/index.tsx';

// --- Hooks ---
import { useTiptapEditor } from '@/shared/hooks/use-tiptap-editor.ts';
// --- Lib ---
import { parseShortcutKeys } from '@/shared/lib/tiptap-utils.ts';
import { Badge } from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/badge';
import { Button } from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/button';
import {
  IMAGE_UPLOAD_SHORTCUT_KEY,
  useImageUpload
} from '@/shared/ui/tiptap-editor/tiptap-ui/image-upload-button/index.tsx';

type IconProps = React.SVGProps<SVGSVGElement>;
type IconComponent = ({ className, ...props }: IconProps) => React.ReactElement;

export interface ImageUploadButtonProps extends Omit<ButtonProps, 'type'>, UseImageUploadConfig {
  /**
   * Optional custom icon component to render instead of the default.
   */
  icon?: React.FC<IconProps> | React.MemoExoticComponent<IconComponent>;
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

export const ImageShortcutBadge = ({
  shortcutKeys = IMAGE_UPLOAD_SHORTCUT_KEY
}: {
  shortcutKeys?: string;
}) => {
  return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
};

/**
 * Button component for uploading/inserting images in a Tiptap editor.
 *
 * For custom button implementations, use the `useImage` hook instead.
 */
export const ImageUploadButton = ({
  ref,
  editor: providedEditor,
  text,
  hideWhenUnavailable = false,
  onInserted,
  showShortcut = false,
  onClick,
  icon: CustomIcon,
  children,
  ...buttonProps
}: ImageUploadButtonProps & { ref?: React.RefObject<HTMLButtonElement | null> }) => {
  const { editor } = useTiptapEditor(providedEditor);
  const { isVisible, canInsert, handleImage, label, isActive, shortcutKeys, Icon } = useImageUpload(
    {
      editor,
      hideWhenUnavailable,
      onInserted
    }
  );

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      handleImage();
    },
    [handleImage, onClick]
  );

  if (!isVisible) {
    return null;
  }

  const RenderIcon = CustomIcon ?? Icon;

  return (
    <Button
      aria-label={label}
      aria-pressed={isActive}
      data-active-state={isActive ? 'on' : 'off'}
      data-disabled={!canInsert}
      disabled={!canInsert}
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
          <RenderIcon className='tiptap-button-icon' />
          {text && <span className='tiptap-button-text'>{text}</span>}
          {showShortcut && <ImageShortcutBadge shortcutKeys={shortcutKeys} />}
        </>
      )}
    </Button>
  );
};

ImageUploadButton.displayName = 'ImageUploadButton';
