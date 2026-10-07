import type { ReactNode } from 'react';

import { formatPrice } from '@/shared/lib/format';

export const PRODUCT_DETAIL_TAB_VALUES = {
  overview: 'overview',
  variants: 'variants',
  media: 'media',
  activity: 'activity'
} as const;

export interface ProductDetailMediaItem {
  file: string;
  product_media_type: 'photo' | 'video';
  product_variant: number;
  variant: ProductVariant;
}

export const getProductTotalStock = (product: Product) =>
  product.variants.reduce((sum, variant) => sum + variant.stock_quantity, 0);

export const getProductAllMedias = (product: Product): ProductDetailMediaItem[] =>
  product.variants.flatMap((variant) =>
    variant.medias.map((media) => ({
      ...media,
      variant
    }))
  );

export const getProductLeadTimeLabel = (product: Product, daysLabel: string) =>
  product.lead_time_min === product.lead_time_max
    ? `${product.lead_time_min} ${daysLabel}`
    : `${product.lead_time_min}-${product.lead_time_max} ${daysLabel}`;

export const getFormattedProductPrice = (product: Product, onRequestLabel: ReactNode) => {
  if (product.price_type === 'on_request') return onRequestLabel;
  if (product.price_type === 'exact') return `${formatPrice(product.price_min)}`;

  return `$${formatPrice(product.price_min)} - ${formatPrice(product.price_max)}`;
};
