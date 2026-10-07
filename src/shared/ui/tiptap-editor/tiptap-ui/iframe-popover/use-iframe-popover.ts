import type { Editor } from '@tiptap/react';

import { useCallback, useEffect, useReducer, useState } from 'react';

import { useTiptapEditor } from '@/shared/hooks/use-tiptap-editor';
import { isNodeInSchema, sanitizeUrl } from '@/shared/lib/tiptap-utils';
import { IframeIcon } from '@/shared/ui/tiptap-editor/tiptap-icons/iframe-icon';

export interface UseIframePopoverConfig {
  editor?: Editor | null;
  hideWhenUnavailable?: boolean;
  onSetIframe?: () => void;
}

export function convertYoutubeUrlToEmbed(url: string): string | null {
  try {
    const trimmedUrl = url.trim();

    if (trimmedUrl.startsWith('<iframe')) {
      const srcMatch = trimmedUrl.match(/src=["']([^"']+)["']/i);
      if (!srcMatch?.[1]) return null;
      return srcMatch[1];
    }

    const parsedUrl = new URL(trimmedUrl);

    let videoId: string | null = null;
    let startTime = 0;

    const t = parsedUrl.searchParams.get('t');

    if (t)
      if (t.endsWith('s')) startTime = Number.parseInt(t.replace('s', ''), 10);
      else startTime = Number.parseInt(t, 10);

    if (parsedUrl.hostname === 'youtu.be') videoId = parsedUrl.pathname.slice(1);

    if (
      parsedUrl.hostname.includes('youtube.com') ||
      parsedUrl.hostname.includes('youtube-nocookie.com')
    )
      if (parsedUrl.pathname === '/watch') videoId = parsedUrl.searchParams.get('v');
      else if (parsedUrl.pathname.startsWith('/shorts/'))
        videoId = parsedUrl.pathname.split('/shorts/')[1];
      else if (parsedUrl.pathname.startsWith('/embed/'))
        videoId = parsedUrl.pathname.split('/embed/')[1];
      else if (parsedUrl.pathname.startsWith('/live/'))
        videoId = parsedUrl.pathname.split('/live/')[1];

    if (!videoId) return null;

    videoId = videoId.split('?')[0].split('&')[0];

    const embedUrl = new URL(`https://www.youtube.com/embed/${videoId}`);

    if (startTime > 0) embedUrl.searchParams.set('start', String(startTime));

    return embedUrl.toString();
  } catch {
    return null;
  }
}
function getSafeIframeSrc(value: string): string {
  const rawSrc = convertYoutubeUrlToEmbed(value);
  return sanitizeUrl(rawSrc!, window.location.href, ['http', 'https']);
}

export function canSetIframe(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable || !isNodeInSchema('iframe', editor)) return false;

  try {
    return editor.can().insertContent({
      type: 'iframe',
      attrs: {
        src: 'https://example.com'
      }
    });
  } catch {
    return false;
  }
}

export function useIframePopover(config?: UseIframePopoverConfig) {
  const { editor: providedEditor, hideWhenUnavailable = false, onSetIframe } = config || {};
  const { editor } = useTiptapEditor(providedEditor);
  const [value, setValue] = useState<string>('');
  const [, forceUpdate] = useReducer((value: number) => value + 1, 0);

  const canSet = canSetIframe(editor);
  const isActive = editor?.isActive('iframe') ?? false;
  const isVisible = !hideWhenUnavailable || canSet;

  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      forceUpdate();
    };

    handleSelectionUpdate();
    editor.on('selectionUpdate', handleSelectionUpdate);

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
    };
  }, [editor, hideWhenUnavailable]);

  const setIframe = useCallback(() => {
    if (!editor || !value.trim()) return false;

    const src = getSafeIframeSrc(value);

    if (src === '#') return false;

    editor
      .chain()
      .focus()
      .setIframe({
        src
      })
      .run();

    setValue('');
    onSetIframe?.();

    return true;
  }, [editor, onSetIframe, value]);

  return {
    Icon: IframeIcon,
    canSet,
    isActive,
    isVisible,
    label: 'Embed iframe',
    setIframe,
    setValue,
    value,
    isValidURL: (url: string | null) => !!convertYoutubeUrlToEmbed(url || '')
  };
}
