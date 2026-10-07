import { useLingui } from '@lingui/react/macro';

import { cn } from '@/shared/lib/utils.ts';

interface RfqVariantSelectorProps {
  selectedVariant: ProductVariant;
  variants: ProductVariant[];
  setSelectedVariant: (variant: ProductVariant) => void;
}

export const RfqVariantSelector = ({
  variants,
  selectedVariant,
  setSelectedVariant
}: RfqVariantSelectorProps) => {
  const { t } = useLingui();

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between gap-4'>
        <div className='flex items-center gap-2'>
          <p className='text-sm font-semibold'>{t`Choose variant`}</p>
        </div>
        <p className='text-muted-foreground text-xs'>
          {variants.length} {t`options`}
        </p>
      </div>
      <div className='flex flex-wrap gap-2.5'>
        {variants.map((variant) => (
          <button
            key={variant.id}
            className={cn(
              'group focus-visible:ring-ring bg-muted hover:border-primary/70 relative size-14 overflow-hidden rounded-md border transition focus-visible:ring-2 focus-visible:outline-none sm:size-16',
              selectedVariant.id === variant.id && 'border-primary ring-primary/25 ring-2'
            )}
            type='button'
            onClick={() => setSelectedVariant(variant)}
          >
            <img
              alt={variant.sku_variant}
              className='size-full object-cover transition group-hover:scale-105'
              src={variant.medias[0].file}
            />
          </button>
        ))}
      </div>
    </div>
  );
};
