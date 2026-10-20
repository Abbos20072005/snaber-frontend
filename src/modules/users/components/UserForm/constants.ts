import { t } from '@lingui/core/macro';
import { z } from 'zod';

export const userFormSchema = () =>
  z
    .object({
      full_name: z.string().min(1, t`This field is required.`),
      email: z.union([z.literal(''), z.string().email(t`This is not a valid email.`)]),
      phone_number: z.string().min(1, t`This field is required.`),
      role: z.enum(['admin', 'buyer']),
      is_active: z.boolean(),
      is_blocked: z.boolean().optional(),
      block_reason: z.string().optional()
    })
    .superRefine((value, ctx) => {
      if (value.is_blocked && !value.block_reason?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['block_reason'],
          message: t`This field is required.`
        });
      }
    });

export type UserFormSchema = z.infer<ReturnType<typeof userFormSchema>>;
