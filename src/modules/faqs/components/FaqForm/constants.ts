import { t } from '@lingui/core/macro';
import { z } from 'zod';

export const faqFormSchema = () =>
  z.object({
    name_uz: z.string().min(1, { message: t`This field is required.` }),
    name_ru: z.string().min(1, { message: t`This field is required.` }),
    name_en: z.string().min(1, { message: t`This field is required.` }),
    description_uz: z.string().min(1, { message: t`This field is required.` }),
    description_ru: z.string().min(1, { message: t`This field is required.` }),
    description_en: z.string().min(1, { message: t`This field is required.` })
  });

export type FaqFormSchema = z.infer<ReturnType<typeof faqFormSchema>>;
