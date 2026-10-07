import { t } from '@lingui/core/macro';
import { z } from 'zod';

import { createFileArraySchema } from '@/shared/constants/helperSchemas.ts';

export const attributeValueFormSchema = () =>
  z.object({
    attribute: z
      .object({
        label: z.string(),
        value: z.string().min(1, t`Attribute is required`)
      })
      .nullable()
      .refine(Boolean, t`Attribute is required`),
    value_uz: z.string().min(1, t`Value is required`),
    value_ru: z.string().min(1, t`Value is required`),
    value_en: z.string().min(1, t`Value is required`),
    image: createFileArraySchema()
  });

export type AttributeValueFormSchema = z.infer<ReturnType<typeof attributeValueFormSchema>>;
