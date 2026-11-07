import type { MessageDescriptor } from '@lingui/core';

import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react/macro';

// The editor builds its labels as plain English strings, this maps them to translations.
const tiptapLabels: Record<string, MessageDescriptor> = {
  Bold: msg`Bold`,
  Italic: msg`Italic`,
  Underline: msg`Underline`,
  Strike: msg`Strikethrough`,
  Code: msg`Code`,
  Superscript: msg`Superscript`,
  Subscript: msg`Subscript`,
  Heading: msg`Heading`,
  'Heading 1': msg`Heading 1`,
  'Heading 2': msg`Heading 2`,
  'Heading 3': msg`Heading 3`,
  'Heading 4': msg`Heading 4`,
  'Heading 5': msg`Heading 5`,
  'Heading 6': msg`Heading 6`,
  'Format text as heading': msg`Format text as heading`,
  List: msg`List`,
  'List options': msg`List options`,
  'Bullet List': msg`Bullet list`,
  'Ordered List': msg`Numbered list`,
  'Task List': msg`Task list`,
  Blockquote: msg`Quote`,
  'Code Block': msg`Code block`,
  Undo: msg`Undo`,
  Redo: msg`Redo`,
  'Align left': msg`Align left`,
  'Align center': msg`Align center`,
  'Align right': msg`Align right`,
  'Align justify': msg`Justify`,
  Link: msg`Link`,
  Highlight: msg`Highlight`,
  'Highlight text': msg`Highlight text`,
  'Highlight colors': msg`Highlight colors`,
  'Remove highlight': msg`Remove highlight`,
  'Default background': msg`Default background`,
  'Gray background': msg`Gray background`,
  'Brown background': msg`Brown background`,
  'Orange background': msg`Orange background`,
  'Yellow background': msg`Yellow background`,
  'Green background': msg`Green background`,
  'Blue background': msg`Blue background`,
  'Purple background': msg`Purple background`,
  'Pink background': msg`Pink background`,
  'Red background': msg`Red background`,
  'Add image': msg`Add image`,
  'Embed iframe': msg`Embed iframe`,
  Toolbar: msg`Toolbar`
};

export const useTiptapLabel = () => {
  const { t } = useLingui();

  return <T>(label: T): string | T => {
    const descriptor = typeof label === 'string' ? tiptapLabels[label] : undefined;
    return descriptor ? t(descriptor) : label;
  };
};
