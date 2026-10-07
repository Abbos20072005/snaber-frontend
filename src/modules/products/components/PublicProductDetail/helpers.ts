export interface GalleryImage {
  label: string;
  src: string;
}

export const getLeadTimeLabel = (product: PublicProduct) => {
  if (product.lead_time_min && product.lead_time_max)
    return `${product.lead_time_min}-${product.lead_time_max} days`;

  if (product.lead_time_min) return `${product.lead_time_min}+ days`;
  if (product.lead_time_max) return `Up to ${product.lead_time_max} days`;

  return 'N/A';
};

export const getGallery = (product: PublicProduct, variant?: ProductVariant): GalleryImage[] => {
  const variantImages = (variant?.medias ?? [])
    .filter((media) => media.product_media_type === 'photo')
    .map((media, index) => ({
      label: `${variant?.sku_variant ?? product.sku} photo ${index + 1}`,
      src: media.file
    }));

  if (variantImages.length > 0) return variantImages;

  return [
    {
      label: `${variant?.sku_variant ?? product.sku} fallback image`,
      src: product.image || '/images/chair.png'
    }
  ];
};

export const getVariantTitle = (variant: ProductVariant) => `Variant ${variant.sku_variant}`;
