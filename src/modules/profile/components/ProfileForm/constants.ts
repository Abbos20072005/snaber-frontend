import { t } from '@lingui/core/macro';
import { z } from 'zod';

import { currencyCodes } from '@/modules/currency';
import { createFileArraySchema } from '@/shared/constants/helperSchemas';

export const profileFormSchema = () =>
  z.object({
    full_name: z.string().min(1, t`This field is required.`),
    phone_number: z.string().min(1, t`This field is required.`),
    email: z.string().email(),
    country: z.string().min(1, t`This field is required.`),
    currency: z.enum(currencyCodes),
    image: createFileArraySchema()
  });

export type ProfileFormSchema = z.infer<ReturnType<typeof profileFormSchema>>;
