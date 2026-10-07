import { msg } from '@lingui/core/macro';
import { z } from 'zod';

import { createFileArraySchema } from '@/shared/constants/helperSchemas';

export const commentFormSchema = () =>
  z.object({
    variant: z.string().min(1, msg`Variant is required`),
    text: z
      .string()
      .trim()
      .min(1, msg`Text is required`)
      .max(5000, msg`Text is too long`),
    rating: z
      .number()
      .min(1, msg`Rating is required`)
      .max(5, msg`Rating must be between 1 and 5`),
    images: createFileArraySchema()
  });

export type CommentFormSchema = z.infer<ReturnType<typeof commentFormSchema>>;
