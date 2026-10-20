import { t } from '@lingui/core/macro';
import z from 'zod';

export const phoneFormSchema = () =>
  z.object({
    phone_number: z
      .string()
      .min(1, { message: t`This field has to be filled.` })
      .regex(/^\+998\d{9}$/, t`Enter a valid phone number`)
  });

export type PhoneFormSchema = z.infer<ReturnType<typeof phoneFormSchema>>;
