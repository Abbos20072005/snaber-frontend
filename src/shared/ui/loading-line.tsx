import React from 'react';

interface Props extends React.ComponentProps<'div'> {}

export const LoadingLine = (props: Props) => (
  <>
    <style>
      {`
        @keyframes l1 {
          0% {
            background-position: right;
          }
        }
      `}
    </style>
    <div
      style={{
        height: '2px',
        background:
          'linear-gradient(90deg, var(--muted) 33%, var(--primary) 50%, var(--muted) 66%) #f2f2f2',
        backgroundSize: '300% 100%',
        animation: 'l1 1.5s infinite linear'
      }}
      {...props}
    />
  </>
);
