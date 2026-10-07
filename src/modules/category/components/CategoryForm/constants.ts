import { t } from '@lingui/core/macro';
import { z } from 'zod';

import { createFileArraySchema } from '@/shared/constants/helperSchemas';

export const categoryFormSchema = () =>
  z.object({
    code: z.string().min(1, t`Code is required`),
    name_uz: z.string().min(1, t`Name is required`),
    name_ru: z.string().min(1, t`Name is required`),
    name_en: z.string().min(1, t`Name is required`),
    image: createFileArraySchema(),
    is_active: z.boolean(),
    parent: z
      .object({
        value: z.string(),
        label: z.string()
      })
      .nullable()
  });

export type CategoryFormSchema = z.infer<ReturnType<typeof categoryFormSchema>>;
