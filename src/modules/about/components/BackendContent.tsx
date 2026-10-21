import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';

interface Props {
  html?: string;
}

export const BackendContent = ({ html }: Props) => {
  // DOMPurify needs a DOM, so it only runs in the browser. The server renders an empty
  // container and the sanitized HTML is filled in after mount, which also avoids hydration mismatches.
  const [cleanHtml, setCleanHtml] = useState('');

  useEffect(() => {
    setCleanHtml(
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
      })
    );
  }, [html]);

  return (
    <div
      className='prose prose-neutral dark:prose-invert prose-sm md:prose-base w-full max-w-none [&_iframe]:aspect-video [&_iframe]:h-auto [&_iframe]:w-full [&_iframe]:rounded-md [&_iframe]:border-0'
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
};
