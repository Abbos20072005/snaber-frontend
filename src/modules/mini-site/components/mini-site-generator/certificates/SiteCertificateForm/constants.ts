import { z } from 'zod';

import { createFileArraySchema } from '@/shared/constants/helperSchemas';

export const siteCertificateSchemaForm = () =>
  z.object({
    earned_at: z.string(),
    file: createFileArraySchema(),
    title: z.string()
  });

export type SiteCertificateSchemaForm = z.infer<ReturnType<typeof siteCertificateSchemaForm>>;
