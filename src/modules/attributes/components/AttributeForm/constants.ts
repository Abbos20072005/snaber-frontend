import { t } from '@lingui/core/macro';
import { z } from 'zod';

export const attributeFormSchema = () =>
  z.object({
    attribute_type: z.enum(['boolean', 'multiselect', 'number', 'range', 'select', 'text']),
    category: z
      .object({
        label: z.string(),
        value: z.string().min(1, t`Category is required`)
      })
      .nullable()
      .refine(Boolean, t`Category is required`),
    is_filterable: z.boolean(),
    name_uz: z.string().min(1, t`Name is required`),
    name_en: z.string().min(1, t`Name is required`),
    name_ru: z.string().min(1, t`Name is required`)
  });

export type AttributeFormSchema = z.infer<ReturnType<typeof attributeFormSchema>>;
