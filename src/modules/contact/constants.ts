import { t } from '@lingui/core/macro';
import z from 'zod';
export const contactFormschema = () =>
  z.object({
    full_name: z.string().min(1, { message: t`This field has to be filled.` }),
    email: z.string().email(t`Enter valid email`),
    topic: z.string().min(1, { message: t`This field has to be filled.` }),
    message: z.string().min(1, { message: t`This field has to be filled.` })
  });

export type ContactFormSchema = z.infer<ReturnType<typeof contactFormschema>>;
