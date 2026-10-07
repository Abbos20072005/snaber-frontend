import { t } from '@lingui/core/macro';
import z from 'zod';

export const forgetPasswordEmailFormSchema = () =>
  z.object({
    email: z
      .string()
      .min(1, { message: t`This field has to be filled.` })
      .email(t`This is not a valid email.`)
  });

export const forgetPasswordVerifyFormSchema = () =>
  z
    .object({
      otp_code: z
        .string()
        .min(1, t`This field is required.`)
        .regex(/^\d{6}$/, t`Enter the 6-digit verification code`),
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

export type ForgetPasswordEmailFormSchema = z.infer<
  ReturnType<typeof forgetPasswordEmailFormSchema>
>;
export type ForgetPasswordVerifyFormSchema = z.infer<
  ReturnType<typeof forgetPasswordVerifyFormSchema>
>;
