import { z } from 'zod';

import { createFileArraySchema } from '@/shared/constants/helperSchemas';

export const siteGallerySchemaForm = () =>
  z.object({
    image: createFileArraySchema(),
    title_en: z.string(),
    title_ru: z.string(),
    title_uz: z.string()
  });

export type SiteGallerySchemaForm = z.infer<ReturnType<typeof siteGallerySchemaForm>>;
