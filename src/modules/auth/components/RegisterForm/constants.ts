import type { MessageDescriptor } from '@lingui/core';

import { msg, t } from '@lingui/core/macro';
import z from 'zod';

export const roles = ['buyer', 'seller'] as const;

export const rolesLabelMap: Record<Roles, MessageDescriptor> = {
  seller: msg`Seller`,
  buyer: msg`Buyer`
};
export const rolesLabelOptions = Object.entries(rolesLabelMap).map(([key, value]) => ({
  value: key as Roles,
  label: value
}));

export const registerFormSchema = () =>
  z.object({
    full_name: z.string().min(1, { message: t`This field has to be filled` }),
    email: z
      .string()
      .min(1, { message: t`This field has to be filled.` })
      .email(t`This is not a valid email.`),
    password: z
      .string()
      .min(1, t`This field is required.`)
      .min(8, t`Password must be at least 8 characters long`),
    role: z.enum(roles),
    country: z.string().min(1, t`This field is required.`)
  });

export type RegisterFormSchema = z.infer<ReturnType<typeof registerFormSchema>>;
