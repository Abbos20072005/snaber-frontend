import { t } from '@lingui/core/macro';
import { z } from 'zod';

import { createFileArraySchema } from '@/shared/constants/helperSchemas';

export const profileFormSchema = () =>
  z.object({
    full_name: z.string().min(1, t`This field is required.`),
    phone_number: z.string().min(1, t`This field is required.`),
    email: z.string(),
    country: z.string().min(1, t`This field is required.`),
    image: createFileArraySchema()
  });

export type ProfileFormSchema = z.infer<ReturnType<typeof profileFormSchema>>;
