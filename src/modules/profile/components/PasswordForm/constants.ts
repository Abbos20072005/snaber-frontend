import { t } from '@lingui/core/macro';
import z from 'zod';

export const passwordFormSchema = () =>
  z
    .object({
      old_password: z
        .string()
        .min(1, t`This field is required.`)
        .min(8, t`Password must be at least 8 characters long`),
      new_password: z
        .string()
        .min(1, t`This field is required.`)
        .min(8, t`Password must be at least 8 characters long`),
      confirm_password: z
        .string()
        .min(1, t`This field is required.`)
        .min(8, t`Password must be at least 8 characters long`)
    })
    .refine((value) => value.new_password === value.confirm_password, {
      message: t`Passwords do not match`,
      path: ['confirm_password']
    });

export type PasswordFormSchema = z.infer<ReturnType<typeof passwordFormSchema>>;
