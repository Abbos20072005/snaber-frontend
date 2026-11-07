import { t } from '@lingui/core/macro';
import { z } from 'zod';

import { createFileArraySchema } from '@/shared/constants/helperSchemas';

export const quickOrderFormSchema = () =>
  z
    .object({
      text: z.string(),
      file: createFileArraySchema()
    })
    .refine((value) => value.text.trim() || value.file.length > 0, {
      path: ['text'],
      message: t`Write a list or upload a file.`
    });

export type QuickOrderFormSchema = z.infer<ReturnType<typeof quickOrderFormSchema>>;

export const requestFormSchema = (needsPhone: boolean) =>
  z.object({
    comment: z.string(),
    file: createFileArraySchema(),
    phone_number: needsPhone
      ? z.string().regex(/^\+998\d{9}$/, t`Enter a valid phone number`)
      : z.string()
  });

export type RequestFormSchema = z.infer<ReturnType<typeof requestFormSchema>>;
