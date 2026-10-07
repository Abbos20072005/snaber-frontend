import { useCallback, useSyncExternalStore } from 'react';

import { cn } from '@/shared/lib/utils';
import { useCarousel } from '@/shared/ui/carousel';

export const ProductImageIndicators = ({ images }: { images: string[] }) => {
  const { api } = useCarousel();

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (!api) return () => undefined;

      api.on('select', onStoreChange);
      api.on('reInit', onStoreChange);

      return () => {
        api.off('select', onStoreChange);
        api.off('reInit', onStoreChange);
      };
    },
    [api]
  );

  const getSnapshot = useCallback(() => api?.selectedScrollSnap() ?? 0, [api]);
  const activeImageIndex = useSyncExternalStore(subscribe, getSnapshot, () => 0);

  if (images.length <= 1) return null;

  return (
    <div className='absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/25 px-2 py-1'>
      {images.map((image, index) => (
        <span
          key={image}
          className={cn(
            'h-1.5 rounded-full transition-all',
            activeImageIndex === index ? 'w-4 bg-white' : 'w-1.5 bg-white/60'
          )}
        />
      ))}
    </div>
  );
};
