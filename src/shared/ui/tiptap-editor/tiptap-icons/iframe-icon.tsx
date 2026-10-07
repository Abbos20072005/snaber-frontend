import { memo } from 'react';

type SvgProps = React.ComponentPropsWithoutRef<'svg'>;

export const IframeIcon = memo(({ className, ...props }: SvgProps) => {
  return (
    <svg
      className={className}
      fill='none'
      height='24'
      width='24'
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      {...props}
    >
      <path
        d='M4 5.5C4 4.67157 4.67157 4 5.5 4H18.5C19.3284 4 20 4.67157 20 5.5V18.5C20 19.3284 19.3284 20 18.5 20H5.5C4.67157 20 4 19.3284 4 18.5V5.5Z'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
      />
      <path
        d='M10 9L7 12L10 15'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
      />
      <path
        d='M14 9L17 12L14 15'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
      />
    </svg>
  );
});

IframeIcon.displayName = 'IframeIcon';
