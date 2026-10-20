export interface GalleryImage {
  label: string;
  src: string;
}

export const getGallery = (product: PublicProduct): GalleryImage[] => {
  const images = product.medias.map((media, index) => ({
    label: `${product.name} ${index + 1}`,
    src: media.file
  }));

  if (images.length > 0) return images;

  return [{ label: product.name, src: '/images/chair.png' }];
};
