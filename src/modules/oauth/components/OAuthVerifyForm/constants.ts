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

export const oAuthVerifyFormSchema = () =>
  z.object({
    full_name: z.string().min(1, { message: t`This field has to be filled` }),
    email: z
      .string()
      .min(1, { message: t`This field has to be filled.` })
      .email(t`This is not a valid email.`),
    phone_number: z.string().min(1, { message: t`This field has to be filled.` }),
    role: z.enum(roles),
    currency: z.enum(['CNY', 'EUR', 'RUB', 'USD', 'UZS']),
    country: z.string().min(1, t`This field is required.`)
  });

export type OAuthVerifyFormSchema = z.infer<ReturnType<typeof oAuthVerifyFormSchema>>;
