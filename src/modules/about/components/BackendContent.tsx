import DOMPurify from 'dompurify';
import { useMemo } from 'react';

interface Props {
  html?: string;
}

export const BackendContent = ({ html }: Props) => {
  const cleanHtml = useMemo(
    () =>
      DOMPurify.sanitize(html ?? '', {
        ADD_ATTR: [
          'allow',
          'allowfullscreen',
          'data-type',
          'frameborder',
          'height',
          'loading',
          'referrerpolicy',
          'src',
          'title',
          'width'
        ],
        ADD_TAGS: ['iframe']
      }),
    [html]
  );

  return (
    <div
      className='prose prose-neutral dark:prose-invert prose-sm md:prose-base w-full max-w-none [&_iframe]:aspect-video [&_iframe]:h-auto [&_iframe]:w-full [&_iframe]:rounded-md [&_iframe]:border-0'
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
};
