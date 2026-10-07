import { useLingui } from '@lingui/react/macro';
import { z } from 'zod';

export const useCreateMemberSchema = () => {
  const { t } = useLingui();

  return z.object({
    full_name: z.string().min(1, t`Full name is required`),
    email: z
      .string()
      .min(1, t`Email is required`)
      .email(t`Invalid email address`),
    phone_number: z.string().min(1, t`Phone number is required`),
    password: z.string().min(1, t`Password is required`)
  });
};

export type CreateMemberFormValues = z.infer<ReturnType<typeof useCreateMemberSchema>>;
