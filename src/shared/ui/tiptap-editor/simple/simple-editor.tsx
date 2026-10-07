'use client';

import { Highlight } from '@tiptap/extension-highlight';
import { Image } from '@tiptap/extension-image';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { TextAlign } from '@tiptap/extension-text-align';
import { Typography } from '@tiptap/extension-typography';
import { Selection } from '@tiptap/extensions';
import { EditorContent, EditorContext, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';

import { uploadBlogImage } from '@/shared/api/requests/upload-image';
import { MAX_FILE_SIZE } from '@/shared/lib/tiptap-utils';
import { HorizontalRule } from '@/shared/ui/tiptap-editor/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension';
import { Iframe } from '@/shared/ui/tiptap-editor/tiptap-node/iframe-node/iframe-node-extension';
import { ImageUploadNode } from '@/shared/ui/tiptap-editor/tiptap-node/image-upload-node/image-upload-node-extension';
import { Spacer } from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/spacer';
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator
} from '@/shared/ui/tiptap-editor/tiptap-ui-primitive/toolbar';
import { BlockquoteButton } from '@/shared/ui/tiptap-editor/tiptap-ui/blockquote-button';
import { CodeBlockButton } from '@/shared/ui/tiptap-editor/tiptap-ui/code-block-button';
import { ColorHighlightPopover } from '@/shared/ui/tiptap-editor/tiptap-ui/color-highlight-popover';
import { HeadingDropdownMenu } from '@/shared/ui/tiptap-editor/tiptap-ui/heading-dropdown-menu';
import IframePopover from '@/shared/ui/tiptap-editor/tiptap-ui/iframe-popover/iframe-popover.tsx';
import { ImageUploadButton } from '@/shared/ui/tiptap-editor/tiptap-ui/image-upload-button';
import { LinkPopover } from '@/shared/ui/tiptap-editor/tiptap-ui/link-popover';
import { ListDropdownMenu } from '@/shared/ui/tiptap-editor/tiptap-ui/list-dropdown-menu';
import { MarkButton } from '@/shared/ui/tiptap-editor/tiptap-ui/mark-button';
import { TextAlignButton } from '@/shared/ui/tiptap-editor/tiptap-ui/text-align-button';
import { UndoRedoButton } from '@/shared/ui/tiptap-editor/tiptap-ui/undo-redo-button';

import '@/shared/ui/tiptap-editor/tiptap-node/blockquote-node/blockquote-node.scss';
import '@/shared/ui/tiptap-editor/tiptap-node/code-block-node/code-block-node.scss';
import '@/shared/ui/tiptap-editor/tiptap-node/heading-node/heading-node.scss';
import '@/shared/ui/tiptap-editor/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss';
import '@/shared/ui/tiptap-editor/tiptap-node/iframe-node/iframe-node.scss';
import '@/shared/ui/tiptap-editor/tiptap-node/image-node/image-node.scss';
import '@/shared/ui/tiptap-editor/tiptap-node/list-node/list-node.scss';
import '@/shared/ui/tiptap-editor/tiptap-node/paragraph-node/paragraph-node.scss';
import '@/styles/_keyframe-animations.scss';
import '@/styles/_variables.scss';
import './simple-editor.css';

const MainToolbarContent = () => {
  return (
    <>
      <Spacer />

      <ToolbarGroup>
        <UndoRedoButton action='undo' />
        <UndoRedoButton action='redo' />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3, 4]} modal={false} />
        <ListDropdownMenu types={['bulletList', 'orderedList', 'taskList']} modal={false} />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type='bold' />
        <MarkButton type='italic' />
        <MarkButton type='strike' />
        <MarkButton type='code' />
        <IframePopover />
        <MarkButton type='underline' />
        <ColorHighlightPopover />
        <LinkPopover />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type='superscript' />
        <MarkButton type='subscript' />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align='left' />
        <TextAlignButton align='center' />
        <TextAlignButton align='right' />
        <TextAlignButton align='justify' />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ImageUploadButton text='Add' />
      </ToolbarGroup>

      <Spacer />
    </>
  );
};

interface Props {
  content?: string;
  onChange?: (html: string) => void;
}

export const SimpleEditor = ({ content, onChange }: Props) => {
  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: 'off',
        autocorrect: 'off',
        autocapitalize: 'off',
        'aria-label': 'Main content area, start typing to enter text.',
        class: 'simple-editor'
      }
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true
        }
      }),
      HorizontalRule,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Iframe,
      Typography,
      Superscript,
      Subscript,
      Selection,
      ImageUploadNode.configure({
        accept: 'image/*',
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: uploadBlogImage,
        onError: (error) => console.error('Upload failed:', error)
      })
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    }
  });

  return (
    <div className='simple-editor-wrapper'>
      <EditorContext.Provider value={{ editor }}>
        <Toolbar>
          <MainToolbarContent />
        </Toolbar>

        <EditorContent
          className='simple-editor-content w-full'
          editor={editor}
          role='presentation'
        />
      </EditorContext.Provider>
    </div>
  );
};
