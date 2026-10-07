import type { MouseEvent } from 'react';

import React, { useRef, useState } from 'react';

import { useIsMobile } from '@/shared/hooks/use-mobile';
import { cn } from '@/shared/lib/utils';

interface Props extends React.ComponentProps<'img'> {
  containerClassName?: string;
  zoomScale?: number;
}

export const ImageZoomer = ({
  className,
  containerClassName,
  style,
  zoomScale = 2,
  ...props
}: Props) => {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{
    x: number;
    y: number;
    visible: boolean;
  }>({ x: 0, y: 0, visible: false });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    const { left, top, width, height } = container.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    if (x < 0 || y < 0 || x > width || y > height) {
      setPosition((prev) => ({ ...prev, visible: false }));
      return;
    }

    setPosition({ x, y, visible: true });
  };

  const handleMouseLeave = () => {
    setPosition((prev) => ({ ...prev, visible: false }));
  };

  return (
    <div
      ref={containerRef}
      className={cn('relative cursor-zoom-in overflow-hidden rounded-md', containerClassName)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <img
        className={cn(
          'block size-full object-cover transition-transform duration-200',
          className
        )}
        style={
          isMobile
            ? undefined
            : {
                ...style,
                transformOrigin: `${position.x}px ${position.y}px`,
                transform: position.visible ? `scale(${zoomScale})` : 'scale(1)'
              }
        }
        {...props}
      />
    </div>
  );
};
