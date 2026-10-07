import { mergeAttributes, Node } from '@tiptap/react';

export interface IframeOptions {
  HTMLAttributes: Record<string, unknown>;
}

export interface SetIframeOptions {
  allow?: string;
  height?: string;
  src: string;
  title?: string;
  width?: string;
}

declare module '@tiptap/react' {
  interface Commands<ReturnType> {
    iframe: {
      setIframe: (options: SetIframeOptions) => ReturnType;
    };
  }
}

export const Iframe = Node.create<IframeOptions>({
  name: 'iframe',

  group: 'block',

  atom: true,

  draggable: true,

  selectable: true,

  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },

  addAttributes() {
    return {
      src: {
        default: null
      },
      title: {
        default: 'Embedded content'
      },
      width: {
        default: '100%'
      },
      height: {
        default: '360'
      },
      allow: {
        default:
          'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
      },
      allowfullscreen: {
        default: true,
        parseHTML: (element) => element.hasAttribute('allowfullscreen'),
        renderHTML: (attributes) => (attributes.allowfullscreen ? { allowfullscreen: 'true' } : {})
      }
    };
  },

  parseHTML() {
    return [
      {
        tag: 'iframe[src]'
      }
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      { 'data-type': this.name },
      [
        'iframe',
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
          loading: 'lazy',
          referrerpolicy: 'strict-origin-when-cross-origin'
        })
      ]
    ];
  },

  addCommands() {
    return {
      setIframe:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options
          });
        }
    };
  }
});

export default Iframe;
