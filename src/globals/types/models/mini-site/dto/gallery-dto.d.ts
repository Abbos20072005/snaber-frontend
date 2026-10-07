interface GalleryDto {
  company: number;
  image: File;
  title_en: string;
  title_ru: string;
  title_uz: string;
}

type PostGalleryDto = GalleryDto;
type PatchGalleryDto = Partial<GalleryDto>;
