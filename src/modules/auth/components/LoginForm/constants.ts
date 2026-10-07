import { t } from '@lingui/core/macro';
import z from 'zod';
export const loginFormschema = () =>
  z.object({
    email: z
      .string()
      .min(1, { message: t`This field has to be filled.` })
      .email(t`This is not a valid email.`),
    password: z
      .string()
      .min(1, t`This field is required.`)
      .min(8, t`Password must be at least 8 characters long`)
  });

export type LoginFormSchema = z.infer<ReturnType<typeof loginFormschema>>;
